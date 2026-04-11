import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import NotificationModel from "@/models/NotificationModel";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const userId = session.user.id;

    await NotificationModel.updateMany(
      {
        $or: [
          { audience: "all" },
          { audience: "user", targetUserId: userId },
        ],
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications mark-all-read error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

