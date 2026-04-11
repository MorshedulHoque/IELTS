import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// GET - Fetch all users
export async function GET() {
  try {
    await dbConnect();
    const users = await UserModel.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

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
      role = "user", // default role
      type = "free",
    } = body;

    // ✅ Basic field validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // ✅ Check for existing user
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = await UserModel.create({
      username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      location,
      bio,
      role,
      type,
    });

    // ✅ Strip password from response
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(
      { success: true, data: userWithoutPassword },
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
