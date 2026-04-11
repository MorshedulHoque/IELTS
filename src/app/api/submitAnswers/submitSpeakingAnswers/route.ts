import dbConnect from "@/lib/dbConnect";
import SubmitSpeakingAnswerModel from "@/models/SubmitSpeakingAnswerModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    console.log("Received speaking answer submission:", {
      userId: body.userId,
      testId: body.testId,
      testType: body.testType,
      questionNumbers: body.questionNumbers,
      hasAudioFile: !!body.audioFile,
      hasFeedback: !!body.feedback
    });
    
    // Validate required fields
    if (!body.userId || !body.testId || !body.testType || !body.questionNumbers) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: userId, testId, testType, questionNumbers" 
        },
        { status: 400 }
      );
    }
    
    if (!body.audioFile) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Audio file is required" 
        },
        { status: 400 }
      );
    }
    
    if (!body.feedback) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Feedback analysis is required" 
        },
        { status: 400 }
      );
    }
    
    // Create a submission for each question number
    const submissions = [];
    for (const questionNumber of body.questionNumbers) {
      const submissionData = {
        userId: body.userId,
        testId: body.testId,
        testType: body.testType,
        questionNumber: questionNumber,
        audioFile: body.audioFile,
        cloudinaryPublicId: body.cloudinaryPublicId,
        feedback: body.feedback
      };
      
      const speakingAnswer = await SubmitSpeakingAnswerModel.create(submissionData);
      submissions.push(speakingAnswer);
    }
    
    console.log("Successfully created speaking answers:", submissions.length);
    
    return NextResponse.json({
      success: true,
      data: submissions,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: validationErrors 
        },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Duplicate submission detected" 
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to submit speaking answer",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const testId = searchParams.get('testId');
    
    let query: any = {};
    if (userId) query.userId = userId;
    if (testId) query.testId = testId;
    
    const speakingAnswers = await SubmitSpeakingAnswerModel.find(query)
      .sort({ submittedAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: speakingAnswers,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch speaking answers" },
      { status: 500 }
    );
  }
} 