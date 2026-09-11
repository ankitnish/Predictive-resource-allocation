const express = require('express');
const {
  getIncidents, getIncidentById, createIncident, updateIncident, deleteIncident
} = require('../controllers/incidentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getIncidents);
router.get('/:id', protect, getIncidentById);
router.post('/', protect, authorize('admin', 'coordinator'), createIncident);
router.put('/:id', protect, authorize('admin', 'coordinator'), updateIncident);
router.delete('/:id', protect, authorize('admin', 'coordinator'), deleteIncident);

module.exports = router;