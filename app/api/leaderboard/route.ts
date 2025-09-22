import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConfig";
import { Reward } from "@/database/models/rewardSchema";
import { User } from "@/database/models/userSchema";

export async function GET() {
  await dbConnect();
  console.log("/api/leaderboard (Rewards) hit");

  try {
    const rewards = await Reward.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPoints: { $sum: "$points" },
          rewardCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users", // must match your Mongo collection name
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name", // ✅ use `name` instead of organizationName
          points: "$totalPoints",
          rewardCount: 1,
        },
      },
      { $sort: { points: -1 } },
      { $limit: 10 },
    ]);

    const leaderboard = rewards.map((entry, i) => ({
      rank: i + 1,
      name: entry.name,
      points: entry.points,
      wasteRecycled: `${entry.rewardCount} rewards`,
      impact: `Earned ${entry.points} pts`,
      badge:
        entry.points >= 15000
          ? "Platinum"
          : entry.points >= 10000
          ? "Gold"
          : entry.points >= 5000
          ? "Silver"
          : "Bronze",
    }));

    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
