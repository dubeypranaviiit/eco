import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({   
  clerkId: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User =mongoose.models.User || mongoose.model("User", userSchema);
