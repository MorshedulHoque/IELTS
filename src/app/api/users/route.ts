import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      username,
      email,
      password,
      phone,
      location,
      bio,
      role = "user",
      type = "free",
    } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // console.log("🔑 Generated token:", verificationToken); // DEBUG

    const newUser = await UserModel.create({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      location,
      bio,
      role,
      type,
      authProvider: "credentials",
      emailVerified: null,
      verificationToken,
      verificationTokenExpiry,
    });

    // console.log("User created with token:", verificationToken); // Debug log

    // Send verification email
    try {
      await sendVerificationEmail(
        newUser.email,
        verificationToken,
        newUser.username
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // We still return success because the user is created
      return NextResponse.json(
        {
          success: true,
          message:
            "User created, but we couldn't send the verification email. Please request a new verification link.",
          data: { id: newUser._id },
        },
        { status: 201 }
      );
    }

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(
      {
        success: true,
        message:
          "User created. Please check your email to verify your account.",
        data: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
