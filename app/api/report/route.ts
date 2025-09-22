import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConfig";
import { Report } from "@/database/models/reportSchema";
import { User } from "@/database/models/userSchema";
import { Reward } from "@/database/models/rewardSchema";
import { Transaction } from "@/database/models/transactionSchema";
import { Notification } from "@/database/models/notificationSchema";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { clerkId, location, wasteType, amount, imageUrl, verificationResult } = await req.json();

    if (!clerkId || !location || !wasteType || !amount) {
      console.warn("Missing Fields:", { clerkId, location, wasteType, amount });
      return NextResponse.json(
        { error: "Missing required fields", details: { clerkId, location, wasteType, amount } },
        { status: 400 }
      );
    }
  
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found. Please login again." }, { status: 404 });
    }

    const report = await Report.create({
      userId: user._id,
      location,
      wasteType,
      amount,
      imageUrl,
      verificationResult,
      status: "pending",
    });

    
    const pointsEarned = 10;
    let reward = await Reward.findOne({ userId: user._id });

    if (!reward) {
  
      reward = await Reward.create({
        userId: user._id,
        name: "Default Reward",
        collectionInfo: "Default Collection Info",
        points: pointsEarned,
        level: 1,
        isAvailable: true,
      });
    } else {
      reward.points += pointsEarned;
      reward.updatedAt = new Date();
      await reward.save();
    }

   
    await Transaction.create({
      userId: user._id,
      type: "earned_report",
      amount: pointsEarned,
      description: "Points earned for reporting waste",
    });

    await Notification.create({
      userId: user._id,
      message: `You've earned ${pointsEarned} points for reporting waste!`,
      type: "reward",
    });

    return NextResponse.json(
      { report, reward, message: "Report submitted and reward updated" },
      { status: 201 }
    );
  } catch (err) {
    console.error("createReport API error:", err);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reports = await Report.find({ userId: user._id }).sort({ createdAt: -1 });
    console.log(reports );
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
  console.log(id);
    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
