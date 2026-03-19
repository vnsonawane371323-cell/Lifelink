// ============================================================
//  Donation Routes — LifeLink
//  Handles donation scheduling, completion, and history
// ============================================================

const express = require('express');
const router = express.Router();
const {
  scheduleDonation,
  completeDonation,
  cancelDonation,
  getMyDonations,
  getHospitalDonations,
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ----------------------------------------------------------------
//  Hospital Routes
// ----------------------------------------------------------------

/**
 * @route   POST /api/donation/schedule
 * @desc    Schedule a donation with a matched donor
 * @access  Private (hospital role only)
 * @body    { donorId, requestId, bloodGroup, unitsDonated, donationDate }
 */
router.post('/schedule', protect, authorize('hospital'), scheduleDonation);

/**
 * @route   PUT /api/donation/complete/:id
 * @desc    Mark a scheduled donation as completed
 * @access  Private (hospital role only)
 */
router.put('/complete/:id', protect, authorize('hospital'), completeDonation);

/**
 * @route   PUT /api/donation/cancel/:id
 * @desc    Cancel a scheduled donation
 * @access  Private (hospital role only)
 */
router.put('/cancel/:id', protect, authorize('hospital'), cancelDonation);

/**
 * @route   GET /api/donation/hospital
 * @desc    Get all donations for the logged-in hospital
 * @access  Private (hospital role only)
 * @query   ?status=scheduled|completed|cancelled
 */
router.get('/hospital', protect, authorize('hospital'), getHospitalDonations);

// ----------------------------------------------------------------
//  Donor Routes
// ----------------------------------------------------------------

/**
 * @route   GET /api/donation/my
 * @desc    Get donation history for the logged-in donor
 * @access  Private (donor role only)
 */
router.get('/my', protect, authorize('donor'), getMyDonations);

module.exports = router;
