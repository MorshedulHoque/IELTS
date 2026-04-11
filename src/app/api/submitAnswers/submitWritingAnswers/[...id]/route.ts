import dbConnect from "@/lib/dbConnect";
import SubmitAnswerModel from "@/models/SubmitWritingAnswerModel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;

    const ids = resolvedParams.id;
    console.log('API Route - Received IDs:', ids);

    // If single ID is passed (submission ID)
    if (Array.isArray(ids) && ids.length === 1) {
      const submissionId = ids[0];
      console.log('API Route - Looking for submission by ID:', submissionId);
      
      const result = await SubmitAnswerModel.findById(submissionId);
      
      if (!result) {
        console.log('API Route - No submission found with ID:', submissionId);
        return NextResponse.json(
          {
            success: false,
            error: "No submission found with the provided ID",
          },
          { status: 404 }
        );
      }

      console.log('API Route - Found submission:', result._id);
      return NextResponse.json({ success: true, data: result });
    }

    // If two IDs are passed (testId and userId) - keep for backward compatibility
    if (Array.isArray(ids) && ids.length === 2) {
      const [testId, userId] = ids;
      console.log('API Route - Parsed IDs:', { testId, userId });

      // Try to find the submission with more flexible matching
      let result = await SubmitAnswerModel.findOne({ testId, userId }).sort({
        submittedAt: -1,
      });

      // If not found, try with string comparison
      if (!result) {
        console.log('API Route - Not found with exact match, trying string comparison');
        result = await SubmitAnswerModel.findOne({
          testId: testId.toString(),
          userId: userId.toString()
        }).sort({
          submittedAt: -1,
        });
      }

      if (!result) {
        console.log('API Route - No data found for:', { testId, userId });
        return NextResponse.json(
          {
            success: false,
            error: "No data found for the provided testId and userId",
          },
          { status: 404 }
        );
      }

      console.log('API Route - Found result:', result._id);
      return NextResponse.json({ success: true, data: result });
    }

    console.log('API Route - Invalid IDs format:', ids);
    return NextResponse.json(
      { success: false, error: "Invalid ID format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error - Failed to fetch data" },
      { status: 500 }
    );
  }
}
