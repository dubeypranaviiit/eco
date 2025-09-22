import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConfig";
import { User } from "@/database/models/userSchema";
import { Reward } from "@/database/models/rewardSchema";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "clerkId is required" }, { status: 400 });
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rewards = await Reward.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(rewards);
  } catch (err) {
    console.error("Error fetching rewards:", err);
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const reward = await Reward.findByIdAndDelete(id);
    if (!reward) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reward deleted successfully" });
  } catch (err) {
    console.error("Error deleting reward:", err);
    return NextResponse.json({ error: "Failed to delete reward" }, { status: 500 });
  }
}
