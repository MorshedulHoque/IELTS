import dbConnect from "@/lib/dbConnect";
import SpeakingModel from "@/models/SpeakingModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const speakingTest = await SpeakingModel.findById(id);
    
    if (!speakingTest) {
      return NextResponse.json(
        { success: false, error: "Speaking test not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: speakingTest,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch speaking test" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const updatedTest = await SpeakingModel.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTest) {
      return NextResponse.json(
        { success: false, error: "Speaking test not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedTest,
    });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update speaking test" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedTest = await SpeakingModel.findByIdAndDelete(id);
    
    if (!deletedTest) {
      return NextResponse.json(
        { success: false, error: "Speaking test not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Speaking test deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete speaking test" },
      { status: 500 }
    );
  }
} 