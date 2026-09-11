const mongoose = require('mongoose');
const { Schema } = mongoose;

const areaSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  population: { type: Number, required: true, min: 0 },
  populationDensity: Number,
  infrastructureCondition: { type: Number, min: 1, max: 5 },
  distanceToHospitalKm: Number,
  isSynthetic: { type: Boolean, default: true },
}, { timestamps: true });

areaSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Area', areaSchema);