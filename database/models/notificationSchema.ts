import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to Users collection
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationsSchema: Schema<INotification> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Users collection
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      maxlength: 50, // Equivalent to varchar(50) in PostgreSQL
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Automatically adds `createdAt` field only
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationsSchema
);