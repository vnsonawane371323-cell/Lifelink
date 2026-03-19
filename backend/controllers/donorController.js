// ============================================================
//  Donor Controller — LifeLink
//  Handles donor profile CRUD operations and search functionality
// ============================================================

const Donor = require('../models/Donor');
const User = require('../models/User');

// ----------------------------------------------------------------
//  @route   POST /api/donor/create
//  @desc    Create a new donor profile
//  @access  Private (donor role only)
// ----------------------------------------------------------------
const createDonorProfile = async (req, res) => {
  try {
    const { bloodGroup, phone, age, gender, city, state, lastDonationDate, medicalNotes, latitude, longitude } = req.body;

    // Check if donor profile already exists for this user
    const existingDonor = await Donor.findOne({ userId: req.user._id });
    if (existingDonor) {
      return res.status(409).json({
        success: false,
        message: 'Donor profile already exists for this user',
      });
    }

    // Validate required fields
    if (!bloodGroup || !phone || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Blood group, phone, age, and gender are required',
      });
    }

    // Build location if coordinates provided
    const donorData = {
      userId: req.user._id,
      bloodGroup,
      phone,
      age,
      gender,
      city,
 
      state,
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : undefined,
      medicalNotes,
    };

    if (latitude != null && longitude != null) {
      donorData.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    // Create donor profile
    const donor = await Donor.create(donorData);

    // Populate user information
    await donor.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Donor profile created successfully',
      data: donor,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during donor profile creation',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donor/me
//  @desc    Get current donor's profile
//  @access  Private (donor role only)
// ----------------------------------------------------------------
const getMyProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id }).populate('userId', 'name email');

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found',
      });
    }

    // Include days until next eligible donation
    const daysUntilEligible = donor.getDaysUntilEligible();

    res.status(200).json({
      success: true,
      message: 'Donor profile retrieved successfully',
      data: {
        ...donor.toObject(),
        daysUntilEligible,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving donor profile',
    });
  }
};

// ----------------------------------------------------------------
//  @route   PUT /api/donor/update
//  @desc    Update donor profile
//  @access  Private (donor role only)
// ----------------------------------------------------------------
const updateDonorProfile = async (req, res) => {
  try {
    const { bloodGroup, phone, age, gender, city, state, lastDonationDate, medicalNotes, latitude, longitude } = req.body;

    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found',
      });
    }

    // Update allowed fields
    if (bloodGroup !== undefined) donor.bloodGroup = bloodGroup;
    if (phone !== undefined) donor.phone = phone;
    if (age !== undefined) donor.age = age;
    if (gender !== undefined) donor.gender = gender;
    if (city !== undefined) donor.city = city;
    if (state !== undefined) donor.state = state;
    if (lastDonationDate !== undefined) {
      donor.lastDonationDate = lastDonationDate ? new Date(lastDonationDate) : null;
    }
    if (medicalNotes !== undefined) donor.medicalNotes = medicalNotes;
    if (latitude != null && longitude != null) {
      donor.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    // Save (pre-save hook will handle availability calculation)
    await donor.save();

    // Populate user information
    await donor.populate('userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Donor profile updated successfully',
      data: donor,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating donor profile',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donor/search
//  @desc    Search for available donors with filters
//  @access  Private (hospital, admin, society roles)
// ----------------------------------------------------------------
const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city, state, isAvailable } = req.query;

    // Build query object
    const query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = new RegExp(city, 'i'); // Case-insensitive search
    if (state) query.state = new RegExp(state, 'i'); // Case-insensitive search
    
    // Default to available donors only, unless explicitly specified
    query.isAvailable = isAvailable === 'false' ? false : true;

    const donors = await Donor.find(query)
      .populate('userId', 'name email')
      .select('-medicalNotes') // Exclude sensitive medical information in search results
      .sort({ updatedAt: -1 })
      .limit(50); // Limit results for performance

    res.status(200).json({
      success: true,
      message: `Found ${donors.length} matching donors`,
      data: donors,
      count: donors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching for donors',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donors/match
//  @desc    Smart donor matching by blood group and geolocation
//  @access  Public
// ----------------------------------------------------------------
const findMatchingDonors = async (req, res) => {
  try {
    const { bloodGroup, lat, lng } = req.query;

    if (!bloodGroup || lat == null || lng == null) {
      return res.status(400).json({
        success: false,
        message: 'Missing search parameters',
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Missing search parameters',
      });
    }

    const donors = await Donor.find({
      bloodGroup,
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 50000,
        },
      },
    })
      .populate('userId', 'name')
      .limit(10);

    const safeDonors = donors.map((donor) => ({
      name: donor.userId?.name || 'Unknown',
      bloodGroup: donor.bloodGroup,
      phone: donor.phone,
      city: donor.city,
    }));

    return res.status(200).json({
      success: true,
      donors: safeDonors,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donor/stats
//  @desc    Get donor statistics
//  @access  Private (admin, hospital, society roles)
// ----------------------------------------------------------------
const getDonorStats = async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const availableDonors = await Donor.countDocuments({ isAvailable: true });
    
    // Blood group distribution
    const bloodGroupStats = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$isAvailable', true] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Donor statistics retrieved successfully',
      data: {
        totalDonors,
        availableDonors,
        unavailableDonors: totalDonors - availableDonors,
        bloodGroupDistribution: bloodGroupStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving donor statistics',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donor/nearby
//  @desc    Find available donors near a location
//  @access  Private (hospital, admin, society roles)
//  @query   ?lat=28.6139&lng=77.2090&radius=10&bloodGroup=O+
// ----------------------------------------------------------------
const findNearbyDonors = async (req, res) => {
  try {
    const { lat, lng, radius, bloodGroup } = req.query;

    // Validate required params
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng query parameters are required',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = parseFloat(radius) || 10; // default 10 km

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng must be valid numbers',
      });
    }

    // Convert radius from km to meters (MongoDB expects meters)
    const radiusMeters = radiusKm * 1000;

    // Build match filter
    const matchFilter = { isAvailable: true };
    if (bloodGroup) matchFilter.bloodGroup = bloodGroup;

    const donors = await Donor.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          distanceField: 'distance', // metres
          maxDistance: radiusMeters,
          spherical: true,
          query: matchFilter,
        },
      },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      { $unwind: '$userId' },
      {
        $project: {
          'userId.password': 0,
          'userId.role': 0,
          medicalNotes: 0,
        },
      },
      { $sort: { distance: 1 } },
      { $limit: 50 },
    ]);

    res.status(200).json({
      success: true,
      message: `Found ${donors.length} donors within ${radiusKm} km`,
      data: donors,
      count: donors.length,
      searchParams: {
        latitude,
        longitude,
        radiusKm,
        bloodGroup: bloodGroup || 'all',
      },
    });
  } catch (error) {
    console.error('Error in findNearbyDonors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching for nearby donors',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donors/map
//  @desc    Return map-friendly donor data near a location
//  @access  Private (authenticated users)
//  @query   ?lat=28.6139&lng=77.2090&radius=25&bloodGroup=O+
// ----------------------------------------------------------------
const getDonorsForMap = async (req, res) => {
  try {
    const { lat, lng, radius, bloodGroup } = req.query;

    const radiusKm = parseFloat(radius) || 25;
    const radiusMeters = radiusKm * 1000;

    const matchFilter = {
      isAvailable: true,
      'location.coordinates.0': { $exists: true },
      'location.coordinates.1': { $exists: true },
    };

    if (bloodGroup) matchFilter.bloodGroup = bloodGroup;

    let donors = [];

    if (lat != null && lng != null) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          message: 'lat and lng must be valid numbers',
        });
      }

      donors = await Donor.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            distanceField: 'distanceMeters',
            maxDistance: radiusMeters,
            spherical: true,
            query: matchFilter,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            name: '$user.name',
            bloodGroup: 1,
            phone: 1,
            city: 1,
            lat: { $arrayElemAt: ['$location.coordinates', 1] },
            lng: { $arrayElemAt: ['$location.coordinates', 0] },
            distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 2] },
          },
        },
        { $sort: { distanceMeters: 1 } },
        { $limit: 100 },
      ]);
    } else {
      donors = await Donor.aggregate([
        { $match: matchFilter },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            name: '$user.name',
            bloodGroup: 1,
            phone: 1,
            city: 1,
            lat: { $arrayElemAt: ['$location.coordinates', 1] },
            lng: { $arrayElemAt: ['$location.coordinates', 0] },
          },
        },
        { $sort: { city: 1 } },
        { $limit: 100 },
      ]);
    }

    res.status(200).json({
      success: true,
      message: `Found ${donors.length} donors for map`,
      data: donors,
      count: donors.length,
    });
  } catch (error) {
    console.error('Error in getDonorsForMap:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donor map data',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donor/leaderboard
//  @desc    Return top donors sorted by reputationScore
//  @access  Public (authenticated)
// ----------------------------------------------------------------
const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const donors = await Donor.find({ totalDonations: { $gte: 1 } })
      .populate('userId', 'name')
      .select('bloodGroup city totalDonations reputationScore badge')
      .sort({ reputationScore: -1 })
      .limit(limit);

    // Add rank
    const leaderboard = donors.map((d, i) => ({
      rank: i + 1,
      name: d.userId?.name,
      bloodGroup: d.bloodGroup,
      city: d.city,
      totalDonations: d.totalDonations,
      reputationScore: d.reputationScore,
      badge: d.badge,
    }));

    res.status(200).json({
      success: true,
      message: `Top ${leaderboard.length} donors`,
      data: leaderboard,
      count: leaderboard.length,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard',
    });
  }
};

const getDonorsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const donors = await Donor.find({
      city: new RegExp(`^${city}$`, 'i'),
      isAvailable: true,
    })
      .populate('userId', 'name email')
      .select('userId bloodGroup phone city state isAvailable totalDonations reputationScore badge createdAt')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: donors,
      count: donors.length,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving donors by city',
    });
  }
};

module.exports = {
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
};