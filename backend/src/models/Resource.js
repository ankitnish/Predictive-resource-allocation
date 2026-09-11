const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceSchema = new Schema({
  type: {
    type: String,
    enum: ['ambulance', 'rescue_team', 'fire_truck', 'medical_unit', 'police_unit', 'emergency_shelter'],
    required: true
  },
  quantity: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['available', 'deployed', 'maintenance'], default: 'available' },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  assignedArea: { type: Schema.Types.ObjectId, ref: 'Area', default: null },
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

resourceSchema.index({ type: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ assignedArea: 1 });

module.exports = mongoose.model('Resource', resourceSchema);