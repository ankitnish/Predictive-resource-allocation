const mongoose = require('mongoose');
const { Schema } = mongoose;

const incidentSchema = new Schema({
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  type: {
    type: String,
    enum: ['flood', 'fire', 'road_accident', 'medical_emergency', 'heatwave', 'disease_outbreak', 'other'],
    required: true
  },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  status: { type: String, enum: ['reported', 'in_progress', 'resolved', 'closed'], default: 'reported' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  populationAffected: { type: Number, default: 0, min: 0 },
  responseTimeMinutes: { type: Number, min: 0 },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  occurredAt: { type: Date, required: true },
  resolvedAt: Date,
  isSynthetic: { type: Boolean, default: true },
}, { timestamps: true });

incidentSchema.index({ area: 1 });
incidentSchema.index({ type: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ occurredAt: -1 });
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);