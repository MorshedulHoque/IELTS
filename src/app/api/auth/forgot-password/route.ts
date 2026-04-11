// app/api/auth/forgot-password/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import ResetTokenModel from "@/models/ResetTokenModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
      // Security: Don't reveal if the user exists
      return NextResponse.json(
        {
          success: true,
          message: "If that user exists, a reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // 2. Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Set expiration (1 hour from now)
    const expires = new Date(Date.now() + 3600 * 1000);

    // 4. Save token to DB (Delete old ones first)
    await ResetTokenModel.deleteMany({ identifier: user.email });
    await ResetTokenModel.create({
      identifier: user.email,
      token: resetToken,
      expires: expires,
    });

    // 5. SEND EMAIL VIA RESEND
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/user/reset-password?token=${resetToken}`;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev", // Default Resend domain for testing
        to: user.email,
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4F46E5;">Password Reset Request</h2>
            <p>Hi ${user.username || "User"},</p>
            <p>You requested a password reset. Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #4F46E5;">${resetUrl}</a>
            </p>
            <p style="margin-top: 20px; font-size: 0.8em; color: #999;">This link will expire in 1 hour.</p>
          </div>
        `,
      });
      console.log("Email successfully sent to:", user.email);
    } catch (emailError) {
      console.error("Resend Error:", emailError);
      // Note: We don't fail the request if the email errors out,
      // but you might want to in production.
    }

    return NextResponse.json(
      { success: true, message: "Reset link sent" },
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
