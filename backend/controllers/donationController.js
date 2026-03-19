// ============================================================
//  Donation Controller — LifeLink
//  Handles donation scheduling, completion, and history
// ============================================================

const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');

// ----------------------------------------------------------------
//  @route   POST /api/donation/schedule
//  @desc    Hospital schedules a donation with a matched donor
//  @access  Private (hospital role only)
// ----------------------------------------------------------------
const scheduleDonation = async (req, res) => {
  try {
    const { donorId, requestId, bloodGroup, unitsDonated, donationDate } = req.body;

    // Validate required fields
    if (!donorId || !requestId || !bloodGroup || !unitsDonated || !donationDate) {
      return res.status(400).json({
        success: false,
        message: 'donorId, requestId, bloodGroup, unitsDonated, and donationDate are required',
      });
    }

    // Verify the donor exists and is available
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }
    if (!donor.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Donor is currently unavailable for donation',
      });
    }

    // Verify the blood request exists
    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    // Check for duplicate scheduled donation
    const existing = await Donation.findOne({
      donorId,
      requestId,
      status: 'scheduled',
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A donation is already scheduled for this donor and request',
      });
    }

    // Create donation record
    const donation = await Donation.create({
      donorId,
      requestId,
      hospitalId: req.user._id,
      bloodGroup,
      unitsDonated,
      donationDate: new Date(donationDate),
      status: 'scheduled',
    });

    // Populate references for response
    await donation.populate('donorId', 'bloodGroup phone city');
    await donation.populate('requestId', 'bloodGroup hospitalName urgency');
    await donation.populate('hospitalId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Donation scheduled successfully',
      data: donation,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }
    console.error('Error scheduling donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while scheduling donation',
    });
  }
};

// ----------------------------------------------------------------
//  @route   PUT /api/donation/complete/:id
//  @desc    Mark a scheduled donation as completed
//  @access  Private (hospital role only)
// ----------------------------------------------------------------
const completeDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found',
      });
    }

    if (donation.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Donation is already marked as completed',
      });
    }
    if (donation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete a cancelled donation',
      });
    }

    // 1. Mark donation as completed
    donation.status = 'completed';
    donation.donationDate = new Date(); // actual completion time
    await donation.save();

    // 2. Update donor: lastDonationDate, availability, and reputation
    const donor = await Donor.findById(donation.donorId);
    if (donor) {
      donor.lastDonationDate = new Date();
      donor.isAvailable = false;

      // 3. Increment totalDonations and reputationScore
      donor.totalDonations = (donor.totalDonations || 0) + 1;
      donor.reputationScore = (donor.reputationScore || 0) + 10;

      // 4. Recalculate badge
      const t = donor.totalDonations;
      if (t >= 25) donor.badge = 'Lifesaver';
      else if (t >= 10) donor.badge = 'Gold Donor';
      else if (t >= 5) donor.badge = 'Silver Donor';
      else if (t >= 1) donor.badge = 'Bronze Donor';
      else donor.badge = 'None';

      await donor.save();
    }

    // Populate for response
    await donation.populate('donorId', 'bloodGroup phone city isAvailable lastDonationDate totalDonations reputationScore badge');
    await donation.populate('requestId', 'bloodGroup hospitalName urgency');
    await donation.populate('hospitalId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Donation completed successfully. Donor availability updated.',
      data: donation,
    });
  } catch (error) {
    console.error('Error completing donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing donation',
    });
  }
};

// ----------------------------------------------------------------
//  @route   PUT /api/donation/cancel/:id
//  @desc    Cancel a scheduled donation
//  @access  Private (hospital role only)
// ----------------------------------------------------------------
const cancelDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found',
      });
    }

    if (donation.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a donation with status "${donation.status}"`,
      });
    }

    donation.status = 'cancelled';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation cancelled',
      data: donation,
    });
  } catch (error) {
    console.error('Error cancelling donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling donation',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donation/my
//  @desc    Get donation history for the logged-in donor
//  @access  Private (donor role only)
// ----------------------------------------------------------------
const getMyDonations = async (req, res) => {
  try {
    // Look up the donor profile for this user
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found',
      });
    }

    const donations = await Donation.find({ donorId: donor._id })
      .populate('requestId', 'bloodGroup hospitalName city urgency')
      .populate('hospitalId', 'name email')
      .sort({ donationDate: -1 });

    res.status(200).json({
      success: true,
      message: `Retrieved ${donations.length} donation records`,
      data: donations,
      count: donations.length,
    });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching donation history',
    });
  }
};

// ----------------------------------------------------------------
//  @route   GET /api/donation/hospital
//  @desc    Get all donations for the logged-in hospital
//  @access  Private (hospital role only)
// ----------------------------------------------------------------
const getHospitalDonations = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { hospitalId: req.user._id };
    if (status) query.status = status;

    const donations = await Donation.find(query)
      .populate('donorId', 'bloodGroup phone city')
      .populate('requestId', 'bloodGroup hospitalName urgency patientName')
      .sort({ donationDate: -1 });

    res.status(200).json({
      success: true,
      message: `Retrieved ${donations.length} donation records`,
      data: donations,
      count: donations.length,
    });
  } catch (error) {
    console.error('Error fetching hospital donations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hospital donations',
    });
  }
};

module.exports = {
  scheduleDonation,
  completeDonation,
  cancelDonation,
  getMyDonations,
  getHospitalDonations,
};
