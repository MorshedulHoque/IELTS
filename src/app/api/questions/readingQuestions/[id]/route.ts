// app/api/questions/reading/[id]/route.ts
import { NextResponse } from "next/server";
// Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect";
import ReadingModel from "@/models/ReadingModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ReadingTest {
  id: string;
  title: string;
  type: string;
  duration: number;
  parts: Array<any>;
}

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

    const test = await ReadingModel.findById(id);
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch reading tests" },
      { status: 500 }
    );
  }
}

// Update an existing reading test
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    await dbConnect();
    const { id } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid MongoDB ObjectID format" },
        { status: 400 }
      );
    }

    const updates: ReadingTest = await request.json();
    const updatedTest = await ReadingModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedTest) {
      return NextResponse.json(
        { success: false, error: "Reading test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTest });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to update reading test" },
      { status: 500 }
    );
  }
}

// Delete a reading test by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    await dbConnect();
    const { id } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid MongoDB ObjectID format" },
        { status: 400 }
      );
    }

    const deletedTest = await ReadingModel.findByIdAndDelete(id);
    if (!deletedTest) {
      return NextResponse.json(
        { success: false, error: "Reading test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to delete reading test" },
      { status: 500 }
    );
  }
}
