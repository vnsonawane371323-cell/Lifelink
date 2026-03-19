// ============================================================
//  Admin Routes — LifeLink
//  Dashboard analytics endpoints for admin panel
// ============================================================

const express = require('express');
const router = express.Router();

const {
  getAdminStats,
  getBloodGroupDistribution,
  getCityDonorDistribution,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/bloodgroups', protect, authorize('admin'), getBloodGroupDistribution);
router.get('/cities', protect, authorize('admin'), getCityDonorDistribution);

module.exports = router;
