import mongoose, { Document, Schema } from "mongoose";
export interface IReport extends Document {
  userId:mongoose.Schema.Types.ObjectId;
  location: string;
  wasteType: string;
  amount: string | number;
  imageUrl?: string; 
  verificationResults?: Record<string, unknown>; 
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}


const reportSchema: Schema<IReport> = new Schema(
  {
    userId: {
       type: mongoose.Schema.Types.ObjectId,
           ref: "User",
    },
    location: {
      type: String,
      required: true,
    },
    wasteType: {
      type: String,
      required: true,
    },
    amount: {
      type: Schema.Types.Mixed,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    verificationResults: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
)
const Report = mongoose.models.Report || mongoose.model<IReport>("Report", reportSchema);

export default Report;
