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
  await dbConnect(); 
    try{
        const existingUser = await User.findOne({email})
        return existingUser
    }catch(error){
        console.log(`Somethig went wrong , please try agai later ${error}`);
        return null;
    }
  }
export async function createNotification(userId: string, message: string, type: string) {
  await dbConnect(); 
    try {
      const notification = await  Notification.create({userId,message,type})
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }
export async function getUnreadNotifications(userId: string) {
  await dbConnect(); 
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
  await dbConnect(); 
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
  await dbConnect(); 
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
  await dbConnect(); 
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
  await dbConnect(); 
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
  await dbConnect(); 
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
  await dbConnect(); 
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
  await dbConnect(); 
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
    const userTransactions = await getRewardTransactions(userId) as any ;
    const userPoints = userTransactions.reduce((total:any, transaction:any) => {
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
export async function getWasteCollectionTask(limit:number=20){
  await dbConnect(); 
  try{
    const tasks = await Report.find({},{
      userId: 1,
      location:1,
      wasteType:1,
      amount:1,
      status:1,
      createdAt: 1,
      collectorId: 1
    }).limit(limit).lean();
    return tasks.map(task => ({
      ...task,
      createdAt: task.createdAt?.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    }));
  }catch(error){
    console.log("get wasteCollection",error)
  }
}

export async  function updateTaskStatus (reportId: number, newStatus: string, collectorId?: number){
  dbConnect();
  try {
    const updateData: any = { status: newStatus };
    if (collectorId !== undefined) {
      updateData.collectorId = collectorId;
    }

    const updatedReport = await Report.findByIdAndUpdate(
      reportId, 
      { $set: updateData }, 
      { new: true, runValidators: true } // Returns updated document & runs validation
    ).lean(); // Converts Mongoose document to plain object

    return updatedReport;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}
export async function saveReward(userId: number, amount: number) {
  try {
    // Create a new reward document
    const reward = await Reward.create({
      userId,
      name: "Waste Collection Reward",
      collectionInfo: "Points earned from waste collection",
      points: amount,
      level: 1,
      isAvailable: true,
    });

    // Create a transaction for this reward
    await createTransaction(userId, "earned_collect", amount, "Points earned for collecting waste");

    return reward;
  } catch (error) {
    console.error("Error saving reward:", error);
    throw error;
  }
}
export async function saveCollectedWaste(
  reportId: string,
  collectorId: string, 
  verificationResult: any
) {
  try {
    // Create a new collected waste document
    const collectedWaste = await CollectedWaste.create({
      reportId,
      collectorId,
      collectionDate: new Date(),
      status: "verified",
    });

    return collectedWaste;
  } catch (error) {
    console.error("Error saving collected waste:", error);
    throw error;
  }
}