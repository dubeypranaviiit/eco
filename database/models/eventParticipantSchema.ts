import mongoose from "mongoose";

const eventParticipantSchema = new mongoose.Schema({

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true
  },

  userId: {
    type: String,  // clerkId
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["joined", "checked-in", "completed"],
    default: "joined"
  }

}, { timestamps: true });

eventParticipantSchema.index(
  { eventId: 1, userId: 1 },
  { unique: true }
);

export const EventParticipant =
  mongoose.models.EventParticipant ||
  mongoose.model("EventParticipant", eventParticipantSchema);