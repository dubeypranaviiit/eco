import dbConnect from "./dbConfig";
import User from "./models/userSchema";
import Report from "./models/reportSchema";
import { Reward } from "./models/rewardSchema";
import { CollectedWaste } from "./models/collectwasteSchema";
import { Notification } from "./models/notificationSchema";

const model ={
    User,Report,Reward,CollectedWaste,Notification,dbConnect
}