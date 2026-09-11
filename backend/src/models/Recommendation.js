const mongoose = require('mongoose');
const { Schema } = mongoose;

const recommendationSchema = new Schema({
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  prediction: { type: Schema.Types.ObjectId, ref: 'Prediction' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  resourceType: {
    type: String,
    enum: ['ambulance', 'rescue_team', 'fire_truck', 'medical_unit', 'police_unit', 'emergency_shelter'],
    required: true
  },
  requiredQuantity: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, min: 0 },
  recommendedAdditional: { type: Number, required: true, min: 0 },
  justification: { type: String, required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'applied', 'dismissed'], default: 'pending' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  generatedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
});

recommendationSchema.index({ area: 1 });
recommendationSchema.index({ priority: 1 });
recommendationSchema.index({ status: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);