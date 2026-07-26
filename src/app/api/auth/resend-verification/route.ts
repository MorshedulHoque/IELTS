import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email already verified" },
        { status: 400 }
      );
    }

    // Generate new token
    const newToken = crypto.randomBytes(32).toString("hex");
    const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.verificationToken = newToken;
    user.verificationTokenExpiry = newExpiry;
    await user.save();

    await sendVerificationEmail(user.email, newToken, user.username);

    return NextResponse.json(
      { success: true, message: "Verification email resent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
