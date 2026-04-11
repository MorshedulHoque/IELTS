import mongoose, { Model, Schema } from "mongoose";

export interface SubmitListeningAnswers extends mongoose.Document {
  userId: String;
  testId: String;
  answers: String;
  totalScore: Number;
  submittedAt: string;
}

const SubmitListeningAnswerSchema = new mongoose.Schema<SubmitListeningAnswers>(
  {
    userId: {
      type: String,
      required: [true, "Please provide a unique userId."],
    },
    testId: {
      type: String,
      required: [true, "Please provide a unique testId"],
    },
    answers: {
      type: Array,
      required: [true, "Please provide answers"],
    },
    submittedAt: {
      type: String,
      required: [true, "Please provide submission time"],
    },
    totalScore: {
      type: Number,
      required: [true, "Please submit your score"],
    },
  }
);

export default (mongoose.models
  .SubmitListeningAnswer as Model<SubmitListeningAnswers>) ||
  mongoose.model<SubmitListeningAnswers>(
    "SubmitListeningAnswer",
    SubmitListeningAnswerSchema
  );
