import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReadingModel from "@/models/ReadingModel";

// GET handler
export async function GET() {
  try {
    await dbConnect();
    const tests = await ReadingModel.find({});
    return NextResponse.json({ success: true, data: tests });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log("Received data:", JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.title || !body.type || !body.duration || !body.parts) {
      console.error("Missing required fields:", { 
        title: !!body.title, 
        type: !!body.type, 
        duration: !!body.duration, 
        parts: !!body.parts 
      });
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate input data here if needed
    const newTest = await ReadingModel.create(body);
    console.log("Created test:", newTest);
    return NextResponse.json({ success: true, data: newTest }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error details:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
    return NextResponse.json(
      { success: false, error: "Invalid data format - Failed to create test", details: error.message },
      { status: 400 }
    );
  }
}