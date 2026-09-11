const mongoose = require('mongoose');
const { Schema } = mongoose;

const weatherDataSchema = new Schema({
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  recordedAt: { type: Date, required: true },
  temperatureC: Number,
  rainfallMm: Number,
  humidityPercent: Number,
  windSpeedKmh: Number,
  condition: String,
  isSynthetic: { type: Boolean, default: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

weatherDataSchema.index({ area: 1, recordedAt: -1 });

module.exports = mongoose.model('WeatherData', weatherDataSchema);