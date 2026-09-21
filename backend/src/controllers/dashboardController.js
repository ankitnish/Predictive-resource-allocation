const Incident = require('../models/Incident');
const Resource = require('../models/Resource');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [activeIncidents, availableResources, deployedResources, avgResponseTimeResult, recentIncidents] = await Promise.all([
    Incident.countDocuments({ status: { $in: ['reported', 'in_progress'] } }),
    Resource.countDocuments({ status: 'available' }),
    Resource.countDocuments({ status: 'deployed' }),
    Incident.aggregate([
      { $match: { responseTimeMinutes: { $exists: true, $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$responseTimeMinutes' } } },
    ]),
    Incident.find().sort({ occurredAt: -1 }).limit(8).populate('area', 'name'),
  ]);

  const avgResponseTime = avgResponseTimeResult[0]?.avg
    ? parseFloat(avgResponseTimeResult[0].avg.toFixed(1))
    : 0;

  return success(res, {
    activeIncidents,
    availableResources,
    deployedResources,
    avgResponseTimeMinutes: avgResponseTime,
    recentIncidents,
    note: 'Risk prediction and demand forecasting metrics will appear here once the ML service is integrated (upcoming module).',
  });
});

module.exports = { getDashboardSummary };
