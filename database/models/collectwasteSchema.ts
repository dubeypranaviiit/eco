import mongoose, { Document, Schema } from "mongoose";

export interface ICollectedWaste extends Document {
  reportId: mongoose.Schema.Types.ObjectId; // Reference to Reports collection
  collectorId: mongoose.Schema.Types.ObjectId; // Reference to Users collection
  collectionDate: Date;
  status: string;
}

const collectedWastesSchema: Schema<ICollectedWaste> = new Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report", // Reference to the Reports collection
      required: true,
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the Users collection
      required: true,
    },
    collectionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "collected",
      maxlength: 20, // Equivalent to varchar(20) in PostgreSQL
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

export const CollectedWaste = mongoose.model<ICollectedWaste>(
  "CollectedWaste",
  collectedWastesSchema
);