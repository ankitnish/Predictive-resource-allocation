const express = require('express');
const {
  getResources, getResourceById, createResource, updateResource, deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getResources);
router.get('/:id', protect, getResourceById);
router.post('/', protect, authorize('admin', 'coordinator'), createResource);
router.put('/:id', protect, authorize('admin', 'coordinator'), updateResource);
router.delete('/:id', protect, authorize('admin'), deleteResource);

module.exports = router;