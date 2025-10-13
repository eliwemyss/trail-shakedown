const express = require('express');
const router = express.Router();
const { estimateSinglePrice } = require('../controllers/priceEstimatorController');

// POST /api/price-estimate
router.post('/', estimateSinglePrice);

module.exports = router;
