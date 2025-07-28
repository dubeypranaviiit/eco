import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAvailable: { type: Boolean, default: true },
  description: String,
  name: { type: String, required: true },
  collectionInfo: { type: String, required: true },
});

export const Reward =mongoose.models.Reward|| mongoose.model('Reward', rewardSchema);
