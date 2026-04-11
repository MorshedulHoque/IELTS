import mongoose, { Model, Schema } from "mongoose";

interface FillerWordAnalysis {
  word: string;
  count: number;
}

interface SpeakingFeedback {
  transcript: string;
  filler_words: FillerWordAnalysis[];
  total_filler_words: number;
  fluency_score: number; // 0-100
  feedback_tips: string[];
  audio_url: string;
  recording_duration: number; // in seconds
}

export interface SubmitSpeakingAnswer extends mongoose.Document {
  userId: string;
  testId: string;
  testType: "part1" | "part2" | "part3" | "full_test";
  questionNumber: number;
  audioFile: string; // URL to the uploaded audio file
  feedback: SpeakingFeedback;
  submittedAt: Date;
  score?: number; // Optional score if implemented later
  cloudinaryPublicId?: string;
}

const SubmitSpeakingAnswerSchema = new mongoose.Schema<SubmitSpeakingAnswer>({
  userId: {
    type: String,
    required: [true, "User ID is required."],
  },
  testId: {
    type: String,
    required: [true, "Test ID is required."],
  },
  testType: {
    type: String,
    required: [true, "Test type is required."],
    enum: ["part1", "part2", "part3", "full_test"],
  },
  questionNumber: {
    type: Number,
    required: [true, "Question number is required."],
  },
  audioFile: {
    type: String,
    required: [true, "Audio file URL is required."],
  },
  cloudinaryPublicId: {
    type: String,
    required: false, // Optional for backward compatibility
  },
  feedback: {
    transcript: {
      type: String,
      required: true,
    },
    filler_words: [
      {
        word: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    total_filler_words: {
      type: Number,
      required: true,
    },
    fluency_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    feedback_tips: [String],
    audio_url: {
      type: String,
      required: true,
    },
    recording_duration: {
      type: Number,
      required: true,
    },
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    required: false,
  },
});

export default (mongoose.models
  .SubmitSpeakingAnswer as Model<SubmitSpeakingAnswer>) ||
  mongoose.model<SubmitSpeakingAnswer>(
    "SubmitSpeakingAnswer",
    SubmitSpeakingAnswerSchema
  );
