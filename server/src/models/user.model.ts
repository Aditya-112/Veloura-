import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  clerkUserId?: string;
  gender?: string;
  avatar?: string;
  outfitsGenerated?: number;
  outfitGenerationDates?: Date[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    clerkUserId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    gender: {
      type: String,
      default: "Prefer not to say",
    },
    avatar: {
      type: String,
      default: "",
    },
    outfitsGenerated: {
      type: Number,
      default: 0,
    },
    outfitGenerationDates: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User",userSchema);

export default User;