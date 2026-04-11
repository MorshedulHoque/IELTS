import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ReadingModel from '@/models/ReadingModel';
import ListeningModel from '@/models/ListeningModel';
import WritingModel from '@/models/WritingModel';
import SpeakingModel from '@/models/SpeakingModel';
import UserModel from '@/models/UserModel';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Fetch all counts in parallel
    const [
      readingCount,
      listeningCount,
      writingCount,
      speakingCount,
      userCount,
      recentTestsCount
    ] = await Promise.all([
      ReadingModel.countDocuments(),
      ListeningModel.countDocuments(),
      WritingModel.countDocuments(),
      SpeakingModel.countDocuments(),
      UserModel.countDocuments(),
      // Count tests created in the last 7 days
      // For existing tests without createdAt, we'll use _id timestamp as fallback
      Promise.all([
        ReadingModel.countDocuments({
          $or: [
            { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            { 
              createdAt: { $exists: false },
              _id: { $gte: new mongoose.Types.ObjectId(Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60)) }
            }
          ]
        }),
        ListeningModel.countDocuments({
          $or: [
            { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            { 
              createdAt: { $exists: false },
              _id: { $gte: new mongoose.Types.ObjectId(Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60)) }
            }
          ]
        }),
        WritingModel.countDocuments({
          $or: [
            { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            { 
              createdAt: { $exists: false },
              _id: { $gte: new mongoose.Types.ObjectId(Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60)) }
            }
          ]
        }),
        SpeakingModel.countDocuments({
          $or: [
            { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            { 
              createdAt: { $exists: false },
              _id: { $gte: new mongoose.Types.ObjectId(Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60)) }
            }
          ]
        })
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0))
    ]);

    return NextResponse.json({
      success: true,
      data: {
        readingTests: readingCount,
        listeningTests: listeningCount,
        writingTests: writingCount,
        speakingTests: speakingCount,
        totalUsers: userCount,
        newTestsThisWeek: recentTestsCount
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin statistics',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
