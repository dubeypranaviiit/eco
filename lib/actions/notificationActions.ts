import { Notification } from "@/database/models/notificationSchema";
import dbConnect from "@/database/dbConfig";
export async function createNotification(userId: string, message: string, type: string) {
 await dbConnect();
  try {
    return await Notification.create({ userId, message, type });
  } catch (err) {
    console.error("createNotification error:", err);
    return null;
  }
}

export async function getUnreadNotifications(userId: string) {
  await dbConnect()
  try {
    return await Notification.find({ userId, isRead: false });
  } catch (err) {
    console.error("getUnreadNotifications error:", err);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  await dbConnect()
  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
  } catch (err) {
    console.error("markNotificationAsRead error:", err);
  }
}
