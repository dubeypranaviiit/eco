import { Reward } from "@/database/models/rewardSchema";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/database/dbConfig";

export async function getOrCreateReward(userId: string) {
  try {
      await dbConnect();
    let reward = await Reward.findOne({ userId });
    if (!reward) {
      reward = await Reward.create({
        userId,
        name: "Default Reward",
        collectionInfo: "Default Collection Info",
        points: 0,
        level: 1,
        isAvailable: true,
      });
    }
    return reward;
  } catch (err) {
    console.error("getOrCreateReward error:", err);
    return null;
  }
}

export async function updateRewardPoints(userId: string, pointsToAdd: number) {
  try {
      await dbConnect();
    const reward = await Reward.findOneAndUpdate(
      { userId },
      { $inc: { points: pointsToAdd }, updatedAt: new Date() },
      { new: true }
    );
    return reward;
  } catch (err) {
    console.error("updateRewardPoints error:", err);
    return null;
  }
}
