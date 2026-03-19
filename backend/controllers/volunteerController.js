const Organization = require('../models/Organization');
const Volunteer = require('../models/Volunteer');

const joinOrganization = async (req, res) => {
  try {
    const { inviteCode, name, bloodGroup, phone, city, age, gender } = req.body;

    if (!inviteCode || !name || !bloodGroup || !phone || !city || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const normalizedInviteCode = inviteCode.trim().toUpperCase();
    const organization = await Organization.findOne({ inviteCode: normalizedInviteCode });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code',
      });
    }

    const volunteer = new Volunteer({
      name,
      bloodGroup,
      phone,
      city,
      age,
      gender,
      organizationId: organization._id,
      isAvailable: true,
      totalDonations: 0,
      reputationScore: 0,
    });

    await volunteer.save();

    return res.status(201).json({
      success: true,
      message: 'Volunteer successfully joined organization',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { joinOrganization };