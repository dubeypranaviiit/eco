import mongoose from "mongoose";

const MONGODB_URL: string = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Please define the MONGODB_URL in .env");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "your-db-name",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("Database connected successfully");
  } catch (error) {
    cached.promise = null;
    console.error("Database connection error:", error);
    throw error;
  }

  (global as any).mongoose = cached;

  return cached.conn;
}

export default dbConnect;