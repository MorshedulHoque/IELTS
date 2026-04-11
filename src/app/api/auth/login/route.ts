// /app/api/auth/login/route.ts (App Router)
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import NotificationModel from "@/models/NotificationModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request: Request) => {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user signed up via OAuth and doesn't have a password
    if (user.authProvider !== "credentials") {
      return NextResponse.json(
        {
          success: false,
          error: `This account was created using ${user.authProvider}. Please sign in with ${user.authProvider} instead.`,
        },
        { status: 401 }
      );
    }

    // Check if user has a password (should always be true for credentials authProvider, but double-check)
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password not set for this account. Please use OAuth login or reset your password.",
        },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if this is a new user and create welcome notification
    try {
      // Check if welcome notification already exists for this user
      const welcomeNotification = await NotificationModel.findOne({
        audience: "user",
        targetUserId: user._id,
        title: { $regex: /welcome|greeting/i },
      });

      // Only create welcome notification if it doesn't exist (first time sign-in)
      if (!welcomeNotification) {
        await NotificationModel.create({
          title: "Welcome to IELTS Prep! 🎉",
          message: `Hello ${
            user.username || "there"
          }! We're thrilled to have you join our IELTS preparation community. Get started by exploring our practice tests, track your progress, and work towards achieving your target band score. Good luck on your IELTS journey!`,
          type: "success",
          audience: "user",
          targetUserId: user._id,
          createdBy: user._id, // User creates their own welcome notification
          link: "/userDashboard",
        });
      }
    } catch (error) {
      // Don't fail login if notification creation fails
      console.error("Error creating welcome notification:", error);
    }

    // Return user as an array to match credentials.authorize() expectation
    const { password: _, ...userData } = user.toObject();

    return NextResponse.json(
      { success: true, data: [userData] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during login" },
      { status: 500 }
    );
  }
};
