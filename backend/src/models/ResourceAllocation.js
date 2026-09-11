const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceAllocationSchema = new Schema({
  resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  quantityAllocated: { type: Number, required: true, min: 1 },
  allocatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  allocatedAt: { type: Date, default: Date.now },
  releasedAt: Date,
});

resourceAllocationSchema.index({ resource: 1 });
resourceAllocationSchema.index({ area: 1 });

module.exports = mongoose.model('ResourceAllocation', resourceAllocationSchema);