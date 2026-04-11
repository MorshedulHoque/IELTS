import dbConnect from "@/lib/dbConnect";
import SubmitSpeakingAnswerModel from "@/models/SubmitSpeakingAnswerModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log("Fetching speaking submission with ID:", id);
    
    const speakingAnswer = await SubmitSpeakingAnswerModel.findById(id);
    
    if (!speakingAnswer) {
      return NextResponse.json(
        { success: false, error: "Speaking submission not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: speakingAnswer,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch speaking submission" },
      { status: 500 }
    );
  }
} 