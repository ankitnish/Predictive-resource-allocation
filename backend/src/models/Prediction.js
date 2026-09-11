const mongoose = require('mongoose');
const { Schema } = mongoose;

const predictionSchema = new Schema({
  area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
  riskScore: { type: Number, required: true, min: 0, max: 1 },
  riskCategory: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  incidentProbability: { type: Number, min: 0, max: 1 },
  predictedIncidents: { type: Number, min: 0 },
  predictedMedicalDemand: { type: Number, default: 0 },
  predictedRescueDemand: { type: Number, default: 0 },
  predictedAmbulanceDemand: { type: Number, default: 0 },
  modelVersion: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
});

predictionSchema.index({ area: 1 });
predictionSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);