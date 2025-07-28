// /app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConfig";
import { User } from "@/database/models/userSchema";
import { Report } from "@/database/models/reportSchema";
export async function GET() {
  await dbConnect();
 console.log("/api/leaderboard hit");
  try {
    const reports = await Report.aggregate([
      {
        $match: {
          "verificationResult.status": "approved"
        }
      },
      {
        $group: {
          _id: "$userId",
          totalWaste: { $sum: 100 }, 
          reportCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          points: "$totalWaste",
          co2Reduction: { $multiply: ["$totalWaste", 2] }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.organizationName", 
          points: 1,
          totalWaste: 1,
          co2Reduction: 1
        }
      },
      { $sort: { points: -1 } },
      { $limit: 10 }
    ]);

    const leaderboard = reports.map((entry, i) => ({
      rank: i + 1,
      name: entry.name,
      points: entry.points,
      wasteRecycled: `${entry.totalWaste} kg`,
      impact: `CO₂ reduction: ${entry.co2Reduction} kg`,
      badge:
        entry.points >= 15000
          ? "Platinum"
          : entry.points >= 12000
          ? "Gold"
          : entry.points >= 11000
          ? "Silver"
          : "Bronze"
    }));
    console.log(leaderboard);

    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
