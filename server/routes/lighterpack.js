const express = require('express');
const router = express.Router();
const { importFromLighterpack } = require('../controllers/lighterpackController');

// POST /api/lighterpack/import - Import gear list from Lighterpack URL
router.post('/import', importFromLighterpack);

module.exports = router;
