const express = require('express');
const router = express.Router();
const { getSocietiesByCity } = require('../controllers/societyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/city/:city', protect, getSocietiesByCity);

module.exports = router;