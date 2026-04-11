import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

// GET - Get user by ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const user = await UserModel.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get user" },
      { status: 400 }
    );
  }
}

// PATCH - Update user by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 400 }
    );
  }
}

// DELETE - Delete user by ID
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const deletedUser = await UserModel.findByIdAndDelete(params.id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 400 }
    );
  }
}
