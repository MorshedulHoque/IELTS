// app/api/questions/reading/[id]/route.ts
import { NextResponse } from "next/server";
// Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect";
import ListeningModel from "@/models/ListeningModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

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

    const test = await ListeningModel.findById(id);
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
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updates = await request.json();
    // Optionally, whitelist fields you allow to be updated:
    // const { title, audioUrl, questions } = updates;

    const updated = await ListeningModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Listening test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error - Failed to update listening test",
      },
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
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const deleted = await ListeningModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Listening test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error - Failed to delete listening test",
      },
      { status: 500 }
    );
  }
}
