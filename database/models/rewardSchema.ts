import mongoose, { Document, Schema } from "mongoose";

export interface IRewards extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  points: number;
  level: number;
  isAvailable: boolean;
  description?: string; 
  name: string;
  collectionInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

const rewardsSchema: Schema<IRewards> = new Schema(
  {
    userId: {
     type: mongoose.Schema.Types.ObjectId,
         ref: "Reports",
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: Number,
      required: true,
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      maxlength: 255, // Equivalent to varchar(255) in PostgreSQL
    },
    collectionInfo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

export const Reward =mongoose.models?.Reward || mongoose.model<IRewards>("Reward", rewardsSchema);