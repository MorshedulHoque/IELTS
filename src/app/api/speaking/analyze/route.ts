import { NextRequest, NextResponse } from "next/server";

// Simple filler word detection function
function detectFillerWords(transcript: string) {
  const fillerWords = [
    "um", "uh", "like", "you know", "basically", "actually", "literally",
    "sort of", "kind of", "i mean", "right", "okay", "well", "so", "yeah"
  ];
  
  const words = transcript.toLowerCase().split(/\s+/);
  const fillerWordCounts: { [key: string]: number } = {};
  let totalFillerWords = 0;
  
  fillerWords.forEach(filler => {
    const count = words.filter(word => word.includes(filler)).length;
    if (count > 0) {
      fillerWordCounts[filler] = count;
      totalFillerWords += count;
    }
  });
  
  return {
    filler_words: Object.entries(fillerWordCounts).map(([word, count]) => ({
      word,
      count
    })),
    total_filler_words: totalFillerWords
  };
}

// Calculate fluency score based on filler words
function calculateFluencyScore(totalFillerWords: number, totalWords: number) {
  const fillerWordRatio = totalFillerWords / totalWords;
  
  if (fillerWordRatio <= 0.02) return 90; // Excellent
  if (fillerWordRatio <= 0.05) return 75; // Good
  if (fillerWordRatio <= 0.08) return 60; // Fair
  if (fillerWordRatio <= 0.12) return 45; // Poor
  return 30; // Very Poor
}

// Generate feedback tips
function generateFeedbackTips(fillerWordCounts: any[], totalFillerWords: number) {
  const tips = [];
  
  if (totalFillerWords > 10) {
    tips.push("Try to reduce filler words to improve your fluency.");
  }
  
  if (fillerWordCounts.some(fw => fw.word === "um" && fw.count > 3)) {
    tips.push("Practice pausing instead of saying 'um' when thinking.");
  }
  
  if (fillerWordCounts.some(fw => fw.word === "like" && fw.count > 2)) {
    tips.push("Avoid overusing 'like' - try to be more precise in your language.");
  }
  
  if (fillerWordCounts.some(fw => fw.word === "you know" && fw.count > 2)) {
    tips.push("Reduce the use of 'you know' - it can make you sound less confident.");
  }
  
  if (tips.length === 0) {
    tips.push("Great job! Your speech is quite fluent.");
  }
  
  return tips;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioUrl, transcript, recordingDuration } = body;
    
    if (!transcript) {
      return NextResponse.json(
        { success: false, error: "Transcript is required" },
        { status: 400 }
      );
    }
    
    // Analyze the transcript
    const { filler_words, total_filler_words } = detectFillerWords(transcript);
    const totalWords = transcript.split(/\s+/).length;
    const fluencyScore = calculateFluencyScore(total_filler_words, totalWords);
    const feedbackTips = generateFeedbackTips(filler_words, total_filler_words);
    
    const analysis = {
      transcript,
      filler_words,
      total_filler_words,
      fluency_score: fluencyScore,
      feedback_tips: feedbackTips,
      audio_url: audioUrl,
      recording_duration: recordingDuration || 0,
      total_words: totalWords
    };
    
    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze speaking audio" },
      { status: 500 }
    );
  }
} 