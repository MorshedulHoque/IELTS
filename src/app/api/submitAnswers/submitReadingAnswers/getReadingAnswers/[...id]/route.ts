import dbConnect from "@/lib/dbConnect";
import SubmitAnswerModel from "@/models/SubmitReadingAnswerModel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;

    const ids = resolvedParams.id;

    // Validate that ids is an array with two valid ObjectIDs
    if (
      !Array.isArray(ids) ||
      ids.length !== 1 ||
      !/^[0-9a-fA-F]{24}$/.test(ids[0])
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid testId or userId format" },
        { status: 400 }
      );
    }

    const [testId] = ids;

    const result = await SubmitAnswerModel.findById(testId);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "No data found for the provided testId and userId",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch data" },
      { status: 500 }
    );
  }
}
