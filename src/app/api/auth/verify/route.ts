import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing token" },
        { status: 400 }
      );
    }

    console.log("Verifying token:", token); // Debug log

    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
      console.log("No user found with that token");
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check expiry
    if (
      user.verificationTokenExpiry &&
      new Date() > user.verificationTokenExpiry
    ) {
      console.log("Token expired");
      return NextResponse.json(
        { success: false, error: "Token has expired" },
        { status: 400 }
      );
    }

    // Mark email as verified
    user.emailVerified = new Date();
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    console.log("User verified successfully");

    // Redirect to sign-in with success param
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return NextResponse.redirect(`${baseUrl}/user/signin?verified=true`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during verification" },
      { status: 500 }
    );
  }
}
