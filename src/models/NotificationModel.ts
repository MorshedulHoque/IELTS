import mongoose, { Model, Schema } from "mongoose";

export interface NotificationDocument extends mongoose.Document {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "urgent";
  link?: string;
  audience: "all" | "user";
  targetUserId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  readBy: string[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "urgent"],
      default: "info",
    },
    link: {
      type: String,
      default: "",
    },
    audience: {
      type: String,
      enum: ["all", "user"],
      default: "all",
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readBy: {
      type: [String],
      default: [],
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ audience: 1, targetUserId: 1 });

// Clear the model cache if it exists to ensure fresh schema
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

export default mongoose.model<NotificationDocument>("Notification", NotificationSchema);

