// app/api/auth/oauth-user/route.ts
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import NotificationModel from "@/models/NotificationModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (request: Request) => {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, name, provider, providerId, image } = body;

    if (!email || !name || !provider) {
      return NextResponse.json(
        { success: false, error: "Email, name, and provider are required" },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    let user;
    let isNewUser = false;

    if (existingUser) {
      // User exists - update with OAuth provider info
      user = existingUser;
      const updateData: any = {
        authProvider: provider,
        providerId: providerId,
        emailVerified: new Date(),
      };

      // Update profile image if provided and user doesn't have one
      if (image && !existingUser.image) {
        updateData.image = image;
      }

      // Update username if it's generic or missing
      if (!existingUser.username || existingUser.username === "user") {
        updateData.username = generateUsernameFromEmail(email, name);
      }

      user = await UserModel.findByIdAndUpdate(existingUser._id, updateData, {
        new: true,
      });
    } else {
      // Create new user for OAuth
      isNewUser = true;
      const username = generateUsernameFromEmail(email, name);

      // Generate a random password for OAuth users
      const randomPassword =
        Math.random().toString(36).slice(-16) +
        Math.random().toString(36).slice(-16);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = await UserModel.create({
        username: username,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        authProvider: provider,
        providerId: providerId,
        role: "user",
        emailVerified: new Date(),
        image: image || null,
        isNewUser: true, // Flag to track first-time users
      });
    }

    // Create welcome notification for NEW OAuth users
    if (isNewUser) {
      try {
        const welcomeNotification = await NotificationModel.findOne({
          audience: "user",
          targetUserId: user._id,
          title: { $regex: /welcome|greeting/i },
        });

        if (!welcomeNotification) {
          await NotificationModel.create({
            title: "Welcome to IELTS Prep! 🎉",
            message: `Hello ${user.username}! We're thrilled to have you join our IELTS preparation community through ${provider}. Get started by exploring our practice tests, track your progress, and work towards achieving your target band score. Good luck on your IELTS journey!`,
            type: "success",
            audience: "user",
            targetUserId: user._id,
            createdBy: user._id,
            link: "/userDashboard",
          });
        }
      } catch (error) {
        console.error("Error creating welcome notification:", error);
      }
    }

    const { password: _, ...userData } = user.toObject();

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: userData._id,
          id: userData._id,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          isNewUser: isNewUser, // Return this flag
        },
      },
      { status: isNewUser ? 201 : 200 }
    );
  } catch (error: any) {
    console.error("OAuth User API Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Server error during OAuth user processing" },
      { status: 500 }
    );
  }
};

function generateUsernameFromEmail(email: string, name: string): string {
  if (name) {
    const cleanName = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    if (cleanName.length >= 3) {
      return cleanName;
    }
  }

  const emailUsername = email.split("@")[0];
  return emailUsername.toLowerCase().replace(/[^a-z0-9]/g, "_");
}
