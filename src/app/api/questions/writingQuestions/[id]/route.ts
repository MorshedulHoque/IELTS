import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WritingModel from "@/models/WritingModel";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate the ID is a properly formatted MongoDB ObjectID
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid MongoDB ObjectID format" },
        { status: 400 }
      );
    }

    const test = await WritingModel.findById(id);
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate the ID is a properly formatted MongoDB ObjectID
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid MongoDB ObjectID format" },
        { status: 400 }
      );
    }

    const body = await request.json(); // Get the updated data from the request body

    // Update the test with the new data
    const updatedTest = await WritingModel.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation before update
    });

    if (!updatedTest) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTest });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to update test" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Validate the ID is a properly formatted MongoDB ObjectID
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid MongoDB ObjectID format" },
        { status: 400 }
      );
    }

    // Find the test by ID and delete
    const deletedTest = await WritingModel.findByIdAndDelete(id);
    if (!deletedTest) {
      return NextResponse.json(
        { success: false, error: "Test not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to delete test" },
      { status: 500 }
    );
  }
}
