import dbConnect from "@/lib/dbConnect";
import OnboardingModel from "@/models/OnboardingModel";
import { NextResponse } from "next/server";

// GET - Get onboarding data by userId
export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const onboarding = await OnboardingModel.findOne({ userId });

    if (!onboarding) {
      return NextResponse.json(
        { success: true, data: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, data: onboarding }, { status: 200 });
  } catch (error) {
    console.error("GET Onboarding Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get onboarding data" },
      { status: 500 }
    );
  }
}

// POST/PATCH - Create or update onboarding data
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const body = await request.json();

    console.log("POST Onboarding - Received data:", { userId, body });

    // Ensure hardestModule is an array if it's provided
    const updateData: any = {
      userId: String(userId), // Ensure userId is a string
    };
    
    // Only include valid schema fields (matching the onboarding questions)
    const validFields = [
      'fullName', 'phoneNo', 'purpose', 'targetScore', 'examDateType', 'customExamDate', 'examDate',
      'englishLevel', 'hardestModule', 'targetCountries', 'status', 'completedAt'
    ];
    
    // Only add fields that are explicitly provided in the request body
    // This prevents Mongoose from applying defaults for fields we don't want
    validFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        updateData[field] = body[field];
      }
    });
    
    // If status is "skipped", only save status and userId - don't set other fields
    if (updateData.status === 'skipped') {
      const skippedData: any = {
        userId: String(userId),
        status: 'skipped'
      };
      
      // Use findOneAndUpdate with setDefaultsOnInsert: false to prevent Mongoose from applying schema defaults
      const onboarding = await OnboardingModel.findOneAndUpdate(
        { userId: String(userId) },
        { $set: skippedData },
        {
          new: true,
          upsert: true,
          runValidators: false,
          strict: false,
          setDefaultsOnInsert: false, // Don't apply schema defaults when creating new document
        }
      );
      
      console.log("POST Onboarding - Success (skipped):", onboarding);
      return NextResponse.json(
        { success: true, data: onboarding },
        { status: 200 }
      );
    }
    
    // Convert hardestModule to array if it's a string (for backward compatibility)
    // Also handle existing records that might have string values
    if (updateData.hardestModule !== undefined) {
      if (typeof updateData.hardestModule === 'string' && updateData.hardestModule !== '') {
        updateData.hardestModule = [updateData.hardestModule];
      } else if (!Array.isArray(updateData.hardestModule)) {
        updateData.hardestModule = [];
      }
    }
    
    // Convert completedAt to Date if it's provided
    if (updateData.completedAt) {
      try {
        updateData.completedAt = new Date(updateData.completedAt);
      } catch (e) {
        console.error("Invalid completedAt date:", updateData.completedAt);
        delete updateData.completedAt;
      }
    }

    // Ensure arrays are properly formatted (only for fields used in onboarding)
    if (updateData.targetCountries && !Array.isArray(updateData.targetCountries)) {
      updateData.targetCountries = [];
    }

    // Remove undefined, null, or invalid values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    console.log("POST Onboarding - Processed data:", updateData);

    // Check if existing record has hardestModule as string (including empty string) and migrate it first
    // Also handle case where field doesn't exist (undefined) - that's fine, we'll set it as array
    try {
      const existingRecord = await OnboardingModel.findOne({ userId: String(userId) }).lean();
      if (existingRecord) {
        // Only migrate if hardestModule exists and is not an array
        if (existingRecord.hardestModule !== undefined && !Array.isArray(existingRecord.hardestModule)) {
          // Migrate using updateOne with validators disabled
          // Convert string to array (empty string becomes empty array, non-empty string becomes single-item array)
          const migratedValue = typeof existingRecord.hardestModule === 'string' && existingRecord.hardestModule !== ''
            ? [existingRecord.hardestModule]
            : [];
          
          await OnboardingModel.updateOne(
            { userId: String(userId) },
            { 
              $set: { 
                hardestModule: migratedValue
              }
            },
            { runValidators: false, strict: false } // Bypass casting issues
          );
          console.log("Migrated hardestModule from string to array:", migratedValue);
        } else if (existingRecord.hardestModule === undefined) {
          console.log("Existing record doesn't have hardestModule field - will be set as array");
        }
      }
    } catch (migrationError) {
      console.error("Error migrating hardestModule:", migrationError);
      // Continue with the update even if migration fails
    }

    // Use raw MongoDB operations to completely bypass Mongoose casting
    // This is necessary because Mongoose still tries to cast even with runValidators: false
    try {
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const collection = db.collection('onboardings');
      
      // Use raw MongoDB findOneAndUpdate to bypass Mongoose casting
      const result = await collection.findOneAndUpdate(
        { userId: String(userId) },
        { $set: updateData },
        {
          upsert: true,
          returnDocument: 'after'
        }
      );
      
      // Fetch the updated document using Mongoose to get proper typing
      const onboarding = await OnboardingModel.findOne({ userId: String(userId) });
      
      if (!onboarding) {
        // If document was just created, find it
        const newDoc = await OnboardingModel.findOne({ userId: String(userId) });
        console.log("POST Onboarding - Success (raw MongoDB):", newDoc);
        return NextResponse.json(
          { success: true, data: newDoc },
          { status: 200 }
        );
      }
      
      console.log("POST Onboarding - Success (raw MongoDB):", onboarding);
      return NextResponse.json(
        { success: true, data: onboarding },
        { status: 200 }
      );
    } catch (rawError) {
      console.error("Raw MongoDB update failed:", rawError);
      // Fallback to Mongoose (shouldn't happen, but just in case)
      throw rawError;
    }
  } catch (error) {
    console.error("POST Onboarding Error - Full error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("POST Onboarding Error - Message:", errorMessage);
    console.error("POST Onboarding Error - Stack:", errorStack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to save onboarding data", 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

// PATCH - Update onboarding data
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const body = await request.json();

    const onboarding = await OnboardingModel.findOneAndUpdate(
      { userId },
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!onboarding) {
      return NextResponse.json(
        { success: false, error: "Onboarding data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: onboarding },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Onboarding Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update onboarding data" },
      { status: 500 }
    );
  }
}

