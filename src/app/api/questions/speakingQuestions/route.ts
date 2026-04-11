import dbConnect from "@/lib/dbConnect";
import SpeakingModel from "@/models/SpeakingModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const speakingTests = await SpeakingModel.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: speakingTests,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch speaking tests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const speakingTest = await SpeakingModel.create(body);
    
    return NextResponse.json({
      success: true,
      data: speakingTest,
    }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create speaking test" },
      { status: 400 }
    );
  }
} 