import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  wasteType: { type: String, required: true },
  amount: { type: String, required: true },
  imageUrl: String,
  verificationResult: mongoose.Schema.Types.Mixed,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


export const Report =mongoose.models.Report || mongoose.model('Report', reportSchema);