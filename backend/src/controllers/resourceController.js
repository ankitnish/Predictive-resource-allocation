const Resource = require('../models/Resource');
const Area = require('../models/Area');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

// GET /api/resources
const getResources = asyncHandler(async (req, res) => {
  const { type, status, area } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (area) filter.assignedArea = area;

  const resources = await Resource.find(filter)
    .populate('assignedArea', 'name')
    .populate('lastUpdatedBy', 'fullName email')
    .sort({ createdAt: -1 });

  return success(res, resources);
});

// GET /api/resources/:id
const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
    .populate('assignedArea', 'name')
    .populate('lastUpdatedBy', 'fullName email');

  if (!resource) {
    return failure(res, 'Resource not found', 404);
  }

  return success(res, resource);
});

// POST /api/resources
const createResource = asyncHandler(async (req, res) => {
  const { type, quantity, status, latitude, longitude, assignedArea } = req.body;

  if (!type || quantity === undefined) {
    return failure(res, 'type and quantity are required', 422);
  }

  if (assignedArea) {
    const areaExists = await Area.findById(assignedArea);
    if (!areaExists) {
      return failure(res, 'Referenced area does not exist', 404);
    }
  }

  const resource = await Resource.create({
    type,
    quantity,
    status: status || 'available',
    currentLocation: (latitude !== undefined && longitude !== undefined)
      ? { coordinates: [longitude, latitude] }
      : undefined,
    assignedArea: assignedArea || null,
    lastUpdatedBy: req.user.id,
  });

  return success(res, resource, 201);
});

// PUT /api/resources/:id
const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return failure(res, 'Resource not found', 404);
  }

  const updatableFields = ['quantity', 'status', 'assignedArea'];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      resource[field] = req.body[field];
    }
  });

  if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
    resource.currentLocation = { coordinates: [req.body.longitude, req.body.latitude] };
  }

  resource.lastUpdatedBy = req.user.id;
  await resource.save();

  return success(res, resource);
});

// DELETE /api/resources/:id
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) {
    return failure(res, 'Resource not found', 404);
  }

  return success(res, { message: 'Resource deleted successfully' });
});

module.exports = { getResources, getResourceById, createResource, updateResource, deleteResource };