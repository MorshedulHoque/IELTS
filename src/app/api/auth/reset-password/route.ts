import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import ResetTokenModel from "@/models/ResetTokenModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Token and password are required" },
        { status: 400 }
      );
    }

    // 1. Find the token in DB
    const resetRecord = await ResetTokenModel.findOne({ token });

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // 2. Check if token has expired
    if (new Date() > resetRecord.expires) {
      return NextResponse.json(
        { success: false, error: "Token has expired" },
        { status: 400 }
      );
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update the User's password
    await UserModel.findOneAndUpdate(
      { email: resetRecord.identifier },
      { password: hashedPassword, authProvider: "credentials" }
    );

    // 5. Delete the token so it cannot be used again
    await ResetTokenModel.deleteOne({ token });

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
