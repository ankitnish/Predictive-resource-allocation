const express = require('express');
const { getAreas, getAreaById } = require('../controllers/areaController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAreas);
router.get('/:id', protect, getAreaById);

module.exports = router;