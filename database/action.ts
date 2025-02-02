import dbConnect from "./dbConfig";
import User from "./models/userSchema";
import Report from "./models/reportSchema";
import { Reward } from "./models/rewardSchema";
import { CollectedWaste } from "./models/collectwasteSchema";
import { Notification } from "./models/notificationSchema";
import { Transaction } from "./models/transactionSchema";
import mongoose from "mongoose";
const model ={
    User,Report,Reward,CollectedWaste,Notification,dbConnect
}
type ResponseData = {
    success: boolean;
    message?: string;
    user?: object;
  };
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
export async function createNotification(userId: number, message: string, type: string) {
    try {
      const notification = await  Notification.create({userId,message,type})
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }
export async function getUnreadNotifications(userId: number) {
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
export async function markNotificationsAsRead(userId: number) {
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
export async function getRewardTransactions(userId: number) {
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
export async function getUserBalance(userId: number): Promise<number> {
    try {
      const transactions = await getRewardTransactions(userId);
      const balance = transactions.reduce((acc, transaction) => {
        return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount;
      }, 0); 
      return Math.max(balance, 0);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      return 0; 
}
}
