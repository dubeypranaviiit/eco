import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true }, // reference to User.clerkId
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentId: { type: String, required: true }, // from Stripe/Razorpay
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    purpose: { type: String }, // e.g. "Tree Plantation"
  },
  { timestamps: true }
);

export const Donation =
  mongoose.models.Donation ||
  mongoose.model("Donation", donationSchema);
