const Area = require('../models/Area');
const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

// GET /api/areas
const getAreas = asyncHandler(async (req, res) => {
  const areas = await Area.find().lean();

  const enriched = await Promise.all(
    areas.map(async (area) => {
      const [incidentCount, availableResources] = await Promise.all([
        Incident.countDocuments({ area: area._id }),
        Resource.countDocuments({ assignedArea: area._id, status: 'available' }),
      ]);
      return { ...area, incidentCount, availableResources };
    })
  );

  return success(res, enriched);
});

// GET /api/areas/:id
const getAreaById = asyncHandler(async (req, res) => {
  const area = await Area.findById(req.params.id).lean();
  if (!area) {
    return failure(res, 'Area not found', 404);
  }

  const [incidentCount, availableResources, recentIncidents] = await Promise.all([
    Incident.countDocuments({ area: area._id }),
    Resource.countDocuments({ assignedArea: area._id, status: 'available' }),
    Incident.find({ area: area._id }).sort({ occurredAt: -1 }).limit(5),
  ]);

  return success(res, { ...area, incidentCount, availableResources, recentIncidents });
});

module.exports = { getAreas, getAreaById };