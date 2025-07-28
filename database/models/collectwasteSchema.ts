import mongoose from 'mongoose';

const collectedWasteSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collectionDate: { type: Date, default: Date.now },
  status: { type: String, default: 'collected' },
});

export const CollectedWaste =mongoose.models.CollectedWaste || mongoose.model('CollectedWaste', collectedWasteSchema);
