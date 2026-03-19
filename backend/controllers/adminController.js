// ============================================================
//  Admin Controller — LifeLink
//  Aggregated platform analytics endpoints for admin dashboard
// ============================================================

const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ----------------------------------------------------------------
//  @route   GET /api/admin/stats
//  @desc    Get top-level platform metrics
//  @access  Private (admin only)
// ----------------------------------------------------------------
const getAdminStats = async (req, res) => {
  try {
    const [totalDonors, totalBloodRequests, emergencyRequests, registeredSocieties] =
      await Promise.all([
        Donor.countDocuments(),
        BloodRequest.countDocuments(),
        BloodRequest.countDocuments({ urgency: 'emergency' }),
        User.countDocuments({ role: 'society' }),
      ]);

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {
        totalDonors,
        totalBloodRequests,
        emergencyRequests,
        registeredSocieties,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving admin stats',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/admin/bloodgroups
//  @desc    Get donor blood group distribution
//  @access  Private (admin only)
// ----------------------------------------------------------------
const getBloodGroupDistribution = async (req, res) => {
  try {
    const aggregate = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          value: { $sum: 1 },
        },
      },
    ]);

    // Always return all groups, including zero-count groups
    const countMap = new Map(aggregate.map((item) => [item._id, item.value]));
    const data = BLOOD_GROUPS.map((name) => ({
      name,
      value: countMap.get(name) || 0,
    }));

    res.status(200).json({
      success: true,
      message: 'Blood group distribution retrieved successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving blood group distribution',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/admin/cities
//  @desc    Get donor counts grouped by city
//  @access  Private (admin only)
// ----------------------------------------------------------------
const getCityDonorDistribution = async (req, res) => {
  try {
    const data = await Donor.aggregate([
      {
        $match: {
          city: { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: '$city',
          donors: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          city: '$_id',
          donors: 1,
        },
      },
      { $sort: { donors: -1, city: 1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      message: 'City donor distribution retrieved successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving city donor distribution',
    });
  }
};

module.exports = {
  getAdminStats,
  getBloodGroupDistribution,
  getCityDonorDistribution,
};
