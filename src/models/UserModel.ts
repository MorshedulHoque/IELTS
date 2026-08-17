import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: any;
  image: string;
  phone: string;
  location: string;
  bio: string;
  role: string;
  type: string;
  authProvider: string;
  providerId: string;
  emailVerified: Date | null; // can be null (unverified) or Date (verified)
  verificationToken?: string; // optional, only present when verification pending
  verificationTokenExpiry?: Date; // optional, when token expires
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: [true, "Please provide a user Name."],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
    },
    password: {
      type: String,
      required: function (this: User) {
        return this.authProvider === "credentials";
      },
    },
    image: { type: String },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    role: {
      type: String,
      default: "user",
    },
    type: { type: String },
    authProvider: {
      type: String,
      enum: ["credentials", "google", "linkedin"],
      default: "credentials",
    },
    providerId: {
      type: String,
      sparse: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    // NEW fields for email verification
    verificationToken: {
      type: String,
      sparse: true, // allows multiple nulls, but we will unset it after verification
    },
    verificationTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
userSchema.index({ email: 1, authProvider: 1 });
userSchema.index({ providerId: 1, authProvider: 1 }, { sparse: true });
userSchema.index({ verificationToken: 1 }, { sparse: true }); // added for faster token lookups

export default mongoose.models.user || mongoose.model<User>("user", userSchema);
