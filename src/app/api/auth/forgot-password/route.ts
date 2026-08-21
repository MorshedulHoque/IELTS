// app/api/auth/forgot-password/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import ResetTokenModel from "@/models/ResetTokenModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/email"; // adjust path

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Check if user exists
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Surface this explicitly to the UI so the user gets a clear toast.
      return NextResponse.json(
        {
          success: false,
          userExists: false,
          error: "No account found with this email. Please sign up first.",
        },
        { status: 404 }
      );
    }

    // 2. Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Expiration (1 hour)
    const expires = new Date(Date.now() + 3600 * 1000);

    // 4. Save token (delete old ones first)
    await ResetTokenModel.deleteMany({ identifier: user.email });
    await ResetTokenModel.create({
      identifier: user.email,
      token: resetToken,
      expires,
    });

    // 5. Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/user/reset-password?token=${resetToken}`;

    // 6. Send email using Nodemailer
    try {
      await sendResetPasswordEmail(
        user.email,
        resetUrl,
        user.username || "User"
      );
      // console.log("Reset email sent to:", user.email);
    } catch (emailError) {
      console.error("Nodemailer Error:", emailError);
      // You may choose to fail the request if email fails,
      // but returning success keeps it secure.
    }

    return NextResponse.json(
      {
        success: true,
        userExists: true,
        message: "A password reset link has been sent to your email. Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
