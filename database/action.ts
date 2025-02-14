import dbConnect from "./dbConfig";
import User from "./models/userSchema";
import Report from "./models/reportSchema";
import { Reward } from "./models/rewardSchema";
import { CollectedWaste } from "./models/collectwasteSchema";
import { Notification } from "./models/notificationSchema";
import { Transaction } from "./models/transactionSchema";
import {  IReport } from "./models/reportSchema";
import mongoose from "mongoose";
const model ={
    User,Report,Reward,CollectedWaste,Notification,dbConnect
}
type ResponseData = {
    success: boolean;
    message?: string;
    user?: object;
  };
  const Load = async()=>{
    await dbConnect(); 
    console.log(`db connected`);
  }
  Load();
export async function createUser(email: string, name: string) {
    try {
      await dbConnect(); 
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const newUser = await User.create({ email, name});
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("User creation failed");
    }
  }
export async function getUserByEmail(email:string){
    try{
        const existingUser = await User.findOne({email})
        return existingUser
    }catch(error){
        console.log(`Somethig went wrong , please try agai later ${error}`);
        return null;
    }
  }
export async function createNotification(userId: string, message: string, type: string) {
    try {
      const notification = await  Notification.create({userId,message,type})
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }
export async function getUnreadNotifications(userId: string) {
    try {
      const unreadNotifications= await Notification.find({
        userId: userId,
        isRead: false
      })
      return unreadNotifications
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      return [];
    }
  }
export async function markNotificationsAsRead(userId: string) {
    try {
      const readNotifications= await Notification.find({
        userId: userId,
        isRead: true
      })
      return readNotifications
    } catch (error) {
      console.error("Error fetching read notifications:", error);
    }
}
export async function getRewardTransactions(userId: string) {
    try {
        const transactions = await Transaction.find({ userId })
      .select('id type amount description date') 
      .sort({ date: -1 }) 
      .limit(10); 
      const formattedTransactions = transactions.map(t => ({
        ...t.toObject(), 
        date: t.date.toISOString().split('T')[0]
      }));
      return formattedTransactions;
    } catch (error) {
      
    }
  }
export async function getUserBalance(userId: string): Promise<number> {
    try {
      const transactions = await getRewardTransactions(userId) || [];
       if(!transactions) return 0;
      const balance = transactions.reduce((acc:number, transaction:any) => {
        return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount;
      }, 0); 
      return Math.max(balance, 0);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      return 0; 
}
}
interface VerificationResult {
  wasteType: string;
  quantity: string;
  confidence: number;
}
export async function createReport(
  userId: string,
  location: string,
  wasteType: string,
  amount: string,
  imageUrl?: string,
  type?: string,
  verificationResult?: VerificationResult
) {
  try {
    // Create a new report document
    const report = new Report({
      userId,
      location,
      wasteType,
      amount,
      imageUrl,
      verificationResult,
      status: "pending",
    });

    await report.save(); // Save to MongoDB

    // Award 10 points for reporting waste
    const pointsEarned = 10;
    await updateRewardPoints(userId, pointsEarned);

    // Create a transaction for the earned points
    await createTransaction(userId,"earned_report", pointsEarned, "Points earned for reporting waste");

    // Create a notification for the user
    await createNotification(userId, `You've earned ${pointsEarned} points for reporting waste!`, "reward");

    return report;
  } catch (error) {
    console.error("Error creating report:", error);
    return null;
  }
}
export async function updateRewardPoints(userId: string, pointsToAdd: number) {
  try {
    const updatedReward = await Reward.findOneAndUpdate(
      { userId }, // Find by userId
      { 
        $inc: { points: pointsToAdd }, // Increment points
        updatedAt: new Date() // Update timestamp
      },
      { new: true } // Return updated document
    );

    return updatedReward;
  } catch (error) {
    console.error("Error updating reward points:", error);
    return null;
  }
}
export async function createTransaction(
  userId: string,
  type: "earned" | "redeemed" | "earned_report" | "earned_collect",
  amount: number,
  description: string
) {
  try {
    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      description,
      date: new Date(),
    });

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}
export async function getRecentReports(limit: number = 10): Promise<IReport[]> {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit) // Limit the number of results
      .exec();
    
    return reports;
  } catch (error) {
    console.error("Error fetching recent reports:", error);
    throw error;
  }
}
export async function getAvailableRewards(userId: string) {
  try {
    await dbConnect();
    if (!userId) {
      throw new Error(' user ID not found');
    }
    // Get user's total points
    const userTransactions = await getRewardTransactions(userId);
    const userPoints = userTransactions.reduce((total, transaction) => {
      return transaction.type.startsWith('earned')
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
    console.log('User total points:', userPoints);
    // Get available rewards from the database
    const dbRewards = await Reward.find({ isAvailable: true })
      .select('id name points description collectionInfo')
      .lean();
    console.log('Rewards from database:', dbRewards);
    // Combine user points and database rewards
    const allRewards = [
      {
        id: '0', // Special ID for user's points
        name: 'Your Points',
        cost: userPoints,
        description: 'Redeem your earned points',
        collectionInfo: 'Points earned from reporting and collecting waste',
      },
      ...dbRewards.map(reward => ({
        id: String(reward._id),
        // id: reward._id.toHexString(),
        name: reward.name,
        cost: reward.points,
        description: reward.description,
        collectionInfo: reward.collectionInfo,
      }))
    ];

    console.log('All available rewards:', allRewards);
    return allRewards;
  } catch (error) {
    console.error('Error fetching available rewards:', error);
    return [];
  }
}
