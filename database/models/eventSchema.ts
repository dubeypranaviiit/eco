import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  location: {
    type: String,
    required: true
  },

  coordinates: {
    lat: Number,
    lng: Number
  },

  createdBy: {
    type: String,   // clerkId
    required: true,
    index: true
  },

  eventDate: {
    type: Date,
    required: true
  },

  maxVolunteers: {
    type: Number,
    default: 50
  },

  volunteersJoined: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming"
  }

}, { timestamps: true });

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);