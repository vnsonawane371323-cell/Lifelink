const express = require('express');
const router = express.Router();
const { getHospitalsByCity } = require('../controllers/hospitalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/city/:city', protect, getHospitalsByCity);

module.exports = router;