const express = require('express');
const router = express.Router();
const { createShakedown } = require('../controllers/shakedownController');

// POST /api/shakedown - Create a new shakedown with gear list
router.post('/', createShakedown);

module.exports = router;
