import mongoose, { Model, Schema } from "mongoose";

interface PartsObject {
  title: string;
  questions: Object;
}

export interface ListeningTest extends mongoose.Document {
  title: String;
  type: String;
  duration: Number;
  audioUrl: String;
  cloudinaryPublicId?: String; // For easy deletion and management
  audioDuration?: Number; // Duration in seconds
  audioFormat?: String; // File format
  audioSize?: Number; // File size in bytes
  parts: PartsObject[];
  createdAt: Date;
  updatedAt: Date;
}

const ListeningSchema = new mongoose.Schema<ListeningTest>({
  title: {
    type: String,
    required: [true, "Please provide a name for title."],
  },
  type: {
    type: String,
    required: [true, "Please provide the type of exam."],
  },
  duration: {
    type: Number,
    required: [true, "Please provide duration of Exam Time."],
  },
  audioUrl: {
    type: String,
    required: [true, "Please provide the audio URL."],
  },
  cloudinaryPublicId: {
    type: String,
    required: false, // Optional for backward compatibility
  },
  audioDuration: {
    type: Number,
    required: false, // Duration in seconds
  },
  audioFormat: {
    type: String,
    required: false, // File format (mp3, wav, etc.)
  },
  audioSize: {
    type: Number,
    required: false, // File size in bytes
  },
  parts: [
    {
      title: String,
      questions: Object,
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default (mongoose.models.ListeningTest as Model<ListeningTest>) ||
  mongoose.model<ListeningTest>("ListeningTest", ListeningSchema);
