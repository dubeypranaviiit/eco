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
  collectorId:mongoose.Schema.Types.ObjectId;
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
      // type: Schema.Types.Mixed,
      wasteType: { type: String },
      quantity: { type: String },
      confidence: { type: Number },
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    collectorId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
)
const Report =mongoose.models?.Report ||  mongoose.model<IReport>("Report", reportSchema);
// mongoose.models.Report ||
export default Report;
