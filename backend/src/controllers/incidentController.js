const Incident = require('../models/Incident');
const Area = require('../models/Area');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

// GET /api/incidents
const getIncidents = asyncHandler(async (req, res) => {
  const { area, type, status, severity } = req.query;
  const filter = {};
  if (area) filter.area = area;
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (severity) filter.severity = severity;

  const incidents = await Incident.find(filter)
    .populate('area', 'name population')
    .populate('reportedBy', 'fullName email')
    .sort({ occurredAt: -1 });

  return success(res, incidents);
});

// GET /api/incidents/:id
const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id)
    .populate('area', 'name population')
    .populate('reportedBy', 'fullName email');

  if (!incident) {
    return failure(res, 'Incident not found', 404);
  }

  return success(res, incident);
});

// POST /api/incidents
const createIncident = asyncHandler(async (req, res) => {
  const {
    area, type, severity, latitude, longitude,
    populationAffected, occurredAt, status
  } = req.body;

  if (!area || !type || !severity || latitude === undefined || longitude === undefined || !occurredAt) {
    return failure(res, 'area, type, severity, latitude, longitude, and occurredAt are required', 422);
  }

  const areaExists = await Area.findById(area);
  if (!areaExists) {
    return failure(res, 'Referenced area does not exist', 404);
  }

  const incident = await Incident.create({
    area,
    type,
    severity,
    status: status || 'reported',
    location: { coordinates: [longitude, latitude] },
    populationAffected: populationAffected || 0,
    occurredAt,
    reportedBy: req.user.id,
    isSynthetic: false, // manually created = real data
  });

  return success(res, incident, 201);
});

// PUT /api/incidents/:id
const updateIncident = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    return failure(res, 'Incident not found', 404);
  }

  const updatableFields = [
    'type', 'severity', 'status', 'populationAffected',
    'responseTimeMinutes', 'resolvedAt'
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      incident[field] = req.body[field];
    }
  });

  if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
    incident.location.coordinates = [req.body.longitude, req.body.latitude];
  }

  await incident.save();

  return success(res, incident);
});

// DELETE /api/incidents/:id
const deleteIncident = asyncHandler(async (req, res) => {
  const incident = await Incident.findByIdAndDelete(req.params.id);
  if (!incident) {
    return failure(res, 'Incident not found', 404);
  }

  return success(res, { message: 'Incident deleted successfully' });
});

module.exports = { getIncidents, getIncidentById, createIncident, updateIncident, deleteIncident };