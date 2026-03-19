const express = require('express');
const router = express.Router();
const {
  createBloodRequest,
  getRecentRequests,
  getCityRequests,
} = require('../controllers/requestController');

router.post('/create', createBloodRequest);
router.get('/recent', getRecentRequests);
router.get('/city/:city', getCityRequests);

module.exports = router;