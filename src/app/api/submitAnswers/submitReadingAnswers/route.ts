import dbConnect from "@/lib/dbConnect";
import SubmitAnswerModel from "@/models/SubmitReadingAnswerModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const submitAnswer = await SubmitAnswerModel.find({});
    return NextResponse.json({ success: true, data: submitAnswer });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch Answers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    // Validate input data here if needed
    const submitAnswer = await SubmitAnswerModel.create(body);
    return NextResponse.json(
      { success: true, data: submitAnswer },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid data format - Failed to submit answer",
      },
      { status: 400 }
    );
  }
}
