// import mongoose, { Model, Schema } from "mongoose";

// interface PartsObject {
//   title: string;
//   instructions: string;
//   passage_title: string;
//   passage_subtitle: string;
//   passage: Array<string> | Array<{ [key: string]: string }>;
//   image?: string;
// }

// export interface WritingTest extends mongoose.Document {
//   title: String;
//   type: String;
//   duration: Number;
//   parts: PartsObject[];
// }

// const WritingSchema = new mongoose.Schema<WritingTest>({
//   title: {
//     type: String,
//     required: [true, "Please provide a name for title."],
//   },
//   type: {
//     type: String,
//     required: [true, "Please provide the type of exam."],
//   },
//   duration: {
//     type: Number,
//     required: [true, "Please provide duration of Exam Time."],
//   },
//   parts: [
//     {
//       title: String,
//       instructions: String,
//       passage_title: String,
//       passage_subtitle: String,
//       passage: [Schema.Types.Mixed],
//       image: String,
//     },
//   ],
// });

// export default (mongoose.models.WritingTest as Model<WritingTest>) ||
//   mongoose.model<WritingTest>("WritingTest", WritingSchema);



import mongoose, { Model, Schema } from "mongoose";

interface PartsObject {
  title: string;
  subtitle: string;
  Question: string[];
  instruction: string[];
  image?: string;
}

export interface WritingTest extends mongoose.Document {
  title: string;
  type: string;
  duration: number;
  parts: PartsObject[];
  createdAt: Date;
  updatedAt: Date;
}

const WritingSchema = new mongoose.Schema<WritingTest>({
  title: {
    type: String,
    required: [true, "Please provide a name for the title."],
  },
  type: {
    type: String,
    required: [true, "Please provide the type of exam."],
  },
  duration: {
    type: Number,
    required: [true, "Please provide the duration of the Exam Time."],
  },
  parts: [
    {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      Question: { type: [String], required: true },  // An array of questions
      instruction: { type: [String], required: true },  // An array of instructions
      image: { type: String, required: false },  // Optional field for the image URL
    },
  ],
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

export default (mongoose.models.WritingTest as Model<WritingTest>) ||
  mongoose.model<WritingTest>("WritingTest", WritingSchema);
