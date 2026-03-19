// ============================================================
//  Prediction Routes — LifeLink
//  GET /api/predictions  →  blood demand prediction data
// ============================================================

const express = require('express');
const router = express.Router();

const { getPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPredictions);

module.exports = router;
