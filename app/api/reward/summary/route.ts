import dbConnect from "@/database/dbConfig";
import { User } from "@/database/models/userSchema";
import { Reward } from "@/database/models/rewardSchema";

import { NextResponse,NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  await dbConnect();;

  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reward = await Reward.findOne({ userId: user._id });
    if (!reward) {
      return NextResponse.json({ points: 0, level: 0, message: "No reward data found" });
    }

    return NextResponse.json({
      points: reward.points,
      level: reward.level,
    });
  } catch (err) {
    console.error("Error fetching reward points:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}