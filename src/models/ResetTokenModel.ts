import mongoose from "mongoose";

const ResetTokenSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

// Prevent model recompilation in hot-reload (Next.js dev)
const ResetTokenModel =
  mongoose.models.ResetToken || mongoose.model("ResetToken", ResetTokenSchema);

export default ResetTokenModel;
