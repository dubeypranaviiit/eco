import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export const Contact =  mongoose.models.Contact || mongoose.model("Contact", contactSchema);
