import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { User } from "@/database/models/userSchema";
import dbConnect from "@/database/dbConfig";
export async function getUserByClerkId(clerkId: string) {
  dbConnect();
  if (!clerkId) return null;

  try {
    const user = await User.findOne({ clerkId });
    return user;
  } catch (err) {
    console.error("Error fetching user by clerkId:", err);
    return null;
  }
}
export async function getUserByEmail(clerkId: string, email: string, name: string) {
  if (!email || !clerkId || !name) return null;

  await dbConnect();

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        clerkId,
      });
    }

    return user;
  } catch (err) {
    console.error("Error fetching or creating user by email:", err);
    return null;
  }
}
export async function createUserIfNotExists(clerkId: string, email: string, name: string) {
  if (!clerkId) return null;

  await dbConnect();

  try {
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ email, name, clerkId });
    }
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}