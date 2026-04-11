import mongoose, { Model, Schema } from "mongoose";

export interface Onboarding extends mongoose.Document {
  userId: string;
  fullName: string;
  phoneNo: string;
  purpose: string;
  targetScore: string;
  examDateType: string;
  customExamDate: string;
  examDate: string;
  englishLevel: string;
  hardestModule: string | string[];
  targetCountries: string[];
  testType: string;
  counsellingInterest: string;
  interestAreas: string[];
  communication: string[];
  availability: string[];
  shareScores: boolean;
  notes: string;
  status: "completed" | "skipped" | "in-progress";
  completedAt?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

const OnboardingSchema = new mongoose.Schema<Onboarding>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true, // One onboarding record per user
    },
    fullName: {
      type: String,
      default: "",
    },
    phoneNo: {
      type: String,
      default: "",
    },
    purpose: {
      type: String,
      default: "",
    },
    targetScore: {
      type: String,
      default: "",
    },
    examDateType: {
      type: String,
      default: "",
    },
    customExamDate: {
      type: String,
      default: "",
    },
    examDate: {
      type: String,
      default: "",
    },
    englishLevel: {
      type: String,
      default: "",
    },
    hardestModule: {
      type: [String],
      default: [],
    },
    targetCountries: {
      type: [String],
      default: [],
    },
    testType: {
      type: String,
      default: "",
    },
    counsellingInterest: {
      type: String,
      default: "",
    },
    interestAreas: {
      type: [String],
      default: [],
    },
    communication: {
      type: [String],
      default: ["Email"],
    },
    availability: {
      type: [String],
      default: [],
    },
    shareScores: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["completed", "skipped", "in-progress"],
      default: "in-progress",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export default (mongoose.models.Onboarding as Model<Onboarding>) ||
  mongoose.model<Onboarding>("Onboarding", OnboardingSchema);

