// ============================================================
//  Donor Routes — LifeLink
//  Handles donor profile management and search endpoints
// ============================================================

const express = require('express');
const router = express.Router();
const {
  createDonorProfile,
  getMyProfile,
  updateDonorProfile,
  searchDonors,
  findMatchingDonors,
  getDonorStats,
  findNearbyDonors,
  getDonorsForMap,
  getLeaderboard,
  getDonorsByCity,
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ----------------------------------------------------------------
//  Donor Profile Management Routes
//  Restricted to donors only
// ----------------------------------------------------------------

/**
 * @route   POST /api/donor/create
 * @desc    Create a new donor profile
 * @access  Private (donor role only)
 */
router.post('/create', protect, authorize('donor'), createDonorProfile);

/**
 * @route   GET /api/donor/me
 * @desc    Get current donor's profile
 * @access  Private (donor role only)
 */
router.get('/me', protect, authorize('donor'), getMyProfile);

/**
 * @route   PUT /api/donor/update
 * @desc    Update donor profile
 * @access  Private (donor role only)
 */
router.put('/update', protect, authorize('donor'), updateDonorProfile);

// ----------------------------------------------------------------
//  Search and Statistics Routes
//  Accessible by hospitals, admins, and societies
// ----------------------------------------------------------------

/**
 * @route   GET /api/donor/search
 * @desc    Search for available donors with filters
 * @access  Private (hospital, admin, society roles)
 * @query   ?bloodGroup=O+&city=Delhi&state=UP&isAvailable=true
 */
router.get('/search', protect, authorize('hospital', 'admin', 'society'), searchDonors);

/**
 * @route   GET /api/donors/match
 * @desc    Smart donor matching with geospatial lookup
 * @access  Public
 * @query   ?bloodGroup=O+&lat=19.0760&lng=72.8777
 */
router.get('/match', findMatchingDonors);

/**
 * @route   GET /api/donor/nearby
 * @desc    Find available donors near a given location (geospatial)
 * @access  Private (hospital, admin, society roles)
 * @query   ?lat=28.6139&lng=77.2090&radius=10&bloodGroup=O+
 */
router.get('/nearby', protect, authorize('hospital', 'admin', 'society'), findNearbyDonors);

/**
 * @route   GET /api/donor/map
 * @desc    Get donor marker data for map rendering
 * @access  Private (authenticated users)
 * @query   ?lat=28.6139&lng=77.2090&radius=25&bloodGroup=O+
 */
router.get('/map', protect, getDonorsForMap);

/**
 * @route   GET /api/donor/leaderboard
 * @desc    Get top donors sorted by reputation score
 * @access  Private (authenticated users)
 * @query   ?limit=20
 */
router.get('/leaderboard', protect, getLeaderboard);

/**
 * @route   GET /api/donors/city/:city
 * @desc    Return available donors for a selected city
 * @access  Private (authenticated users)
 */
router.get('/city/:city', protect, getDonorsByCity);

/**
 * @route   GET /api/donor/stats
 * @desc    Get donor statistics and blood group distribution
 * @access  Private (admin, hospital, society roles)
 */
router.get('/stats', protect, authorize('admin', 'hospital', 'society'), getDonorStats);

module.exports = router;