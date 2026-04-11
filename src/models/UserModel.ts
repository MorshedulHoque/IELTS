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
  // OAuth fields
  authProvider: string;
  providerId: string;
  emailVerified: Date;
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
      // Make password optional for OAuth users
      required: function (this: User) {
        return this.authProvider === "credentials";
      },
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      default: "user", // Add default role
    },
    type: {
      type: String,
    },
    // OAuth fields
    authProvider: {
      type: String,
      enum: ["credentials", "google", "linkedin"],
      default: "credentials",
    },
    providerId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    emailVerified: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Add index for OAuth queries
userSchema.index({ email: 1, authProvider: 1 });
userSchema.index({ providerId: 1, authProvider: 1 }, { sparse: true });

export default mongoose.models.user || mongoose.model<User>("user", userSchema);
