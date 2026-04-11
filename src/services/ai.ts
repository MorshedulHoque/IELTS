import { GoogleGenerativeAI } from "@google/generative-ai";

// Add debug logging
console.log('API Key available:', !!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);
console.log('API Key length:', process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY?.length);

if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  console.error('Google AI API Key is not configured!');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");

interface EvaluationResult {
  score: number;
  feedback: {
    taskAchievement: string;
    coherenceAndCohesion: string;
    lexicalResource: string;
    grammaticalRangeAndAccuracy: string;
  };
  overallFeedback: string;
}

interface WritingEvaluation {
    taskAchievement: number;
    coherenceAndCohesion: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
    finalBandScore: number;
    feedback: string;
}

export async function evaluateWritingAnswer(
  question: string,
  answer: string,
  criteria: string
): Promise<EvaluationResult> {
  try {
    // Log API configuration
    console.log('=== Gemini API Configuration Check ===');
    console.log('API Key configured:', !!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);
    console.log('API Key length:', process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY?.length);
    console.log('Model name:', "gemini-1.5-flash");

    console.log('\n=== Starting Writing Evaluation ===');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an IELTS writing examiner. Evaluate the following writing answer based on the given criteria. 
    Return ONLY a JSON object with the following structure, no other text or formatting:
    {
      "score": number (0-9),
      "feedback": {
        "taskAchievement": string,
        "coherenceAndCohesion": string,
        "lexicalResource": string,
        "grammaticalRangeAndAccuracy": string
      },
      "overallFeedback": string
    }

    Question: ${question}
    Answer: ${answer}
    Criteria: ${criteria}`;

    console.log('\n=== Sending Request to Gemini ===');
    console.log('Prompt length:', prompt.length);
    console.log('Question length:', question.length);
    console.log('Answer length:', answer.length);
    
    const result = await model.generateContent(prompt);
    console.log('\n=== Received Response from Gemini ===');
    
    const response = await result.response;
    console.log('Response received successfully');
    
    const text = response.text();
    console.log('\n=== Raw Response ===');
    console.log('Response length:', text.length);
    console.log('First 100 characters:', text.substring(0, 100));
    
    // Clean the response text by removing markdown code block formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    console.log('\n=== Cleaned Response ===');
    console.log('Cleaned text length:', cleanedText.length);
    console.log('First 100 characters of cleaned text:', cleanedText.substring(0, 100));

    try {
      const evaluation = JSON.parse(cleanedText);
      console.log('\n=== Parsed Evaluation ===');
      console.log('Successfully parsed JSON');
      console.log('Score:', evaluation.score);
      console.log('Feedback categories:', Object.keys(evaluation.feedback));
      return evaluation;
    } catch (parseError) {
      console.error('\n=== JSON Parse Error ===');
      console.error('Error details:', parseError);
      console.error('Failed to parse text:', cleanedText);
      throw new Error('Failed to parse evaluation response');
    }
  } catch (error: any) {
    console.error('\n=== Error in Evaluation Process ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    if (error?.response) {
      console.error('API Response status:', error.response.status);
      console.error('API Response data:', error.response.data);
    }
    throw error;
  }
} 