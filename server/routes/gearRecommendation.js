const express = require('express');
const router = express.Router();
const { generateGearRecommendations } = require('../controllers/gearRecommendationController');

// POST /api/recommendations
router.post('/', generateGearRecommendations);

module.exports = router;
