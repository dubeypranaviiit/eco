import mongoose, { Document, Schema } from "mongoose";

export interface ITransactions extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to Users collection
  type: string; // 'earned' or 'redeemed'
  amount: number;
  description: string;
  date: Date;
}

const transactionsSchema: Schema<ITransactions> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Users collection
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["earned", "redeemed"], // Ensures the value is either 'earned' or 'redeemed'
      maxlength: 20, // Equivalent to varchar(20) in PostgreSQL
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // Automatically sets the current date and time
    },
  },
  { timestamps: false } // Disable automatic `createdAt` and `updatedAt` fields
);

export const Transaction = mongoose.model<ITransactions>(
  "Transaction",
  transactionsSchema
);