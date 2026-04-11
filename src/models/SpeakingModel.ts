import mongoose, { Model, Schema } from "mongoose";

interface Question {
  question_number: number;
  question: string;
  question_type: "personal" | "cue_card" | "discussion";
  preparation_time?: number; // For Part 2 (1 minute prep)
  speaking_time: number; // Speaking duration in minutes
  instructions?: string;
}

export interface SpeakingTest extends mongoose.Document {
  title: string;
  type: "part1" | "part2" | "part3" | "full_test";
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  total_duration: number; // Total test duration in minutes
  createdAt: Date;
  updatedAt: Date;
}

const SpeakingSchema = new mongoose.Schema<SpeakingTest>({
  title: {
    type: String,
    required: [true, "Please provide a title for the speaking test."],
  },
  type: {
    type: String,
    required: [true, "Please provide the type of speaking test."],
    enum: ["part1", "part2", "part3", "full_test"],
  },
  description: {
    type: String,
    required: false,
  },
  difficulty: {
    type: String,
    required: [true, "Please provide the difficulty level."],
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  questions: [
    {
      question_number: {
        type: Number,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      question_type: {
        type: String,
        required: true,
        enum: ["personal", "cue_card", "discussion"],
      },
      preparation_time: {
        type: Number,
        required: false, // Only for Part 2
      },
      speaking_time: {
        type: Number,
        required: true,
      },
      instructions: {
        type: String,
        required: false,
      },
    },
  ],
  total_duration: {
    type: Number,
    required: [true, "Please provide the total duration in minutes."],
  },
}, {
  timestamps: true, // Automatically adds created_at and updated_at
});

export default (mongoose.models.SpeakingTest as Model<SpeakingTest>) ||
  mongoose.model<SpeakingTest>("SpeakingTest", SpeakingSchema); 