import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentId: { type: String, required: true }, 
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    purpose: { type: String }, 
  },
  { timestamps: true }
);

export const Donation =
  mongoose.models.Donation ||
  mongoose.model("Donation", donationSchema);
