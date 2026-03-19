const BloodRequest = require('../models/BloodRequest');
const Organization = require('../models/Organization');
const { sendEmail } = require('../services/emailService');
const { getIO } = require('../services/socketService');

const createBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      hospital,
      unitsRequired,
      contactNumber,
      city,
      urgency,
    } = req.body;

    if (!patientName || !bloodGroup || !city || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'patientName, bloodGroup, city, and contactNumber are required',
      });
    }

    const normalizedCity = city.trim();
    const bloodRequest = new BloodRequest({
      patientName,
      bloodGroup,
      city: normalizedCity,
      hospital,
      unitsRequired,
      contactNumber,
      urgency,
      status: 'active',
    });

    await bloodRequest.save();

    const organizations = await Organization.find({
      city: new RegExp(`^${normalizedCity}$`, 'i'),
      email: { $exists: true, $ne: '' },
    }).select('email');

    const organizationEmails = organizations.map((organization) => organization.email);
    const subject = `URGENT Blood Request in ${normalizedCity}`;
    const body = `Emergency blood request details:

Patient Name: ${patientName}
Blood Group: ${bloodGroup}
Hospital: ${hospital || 'N/A'}
Units Required: ${unitsRequired || 'N/A'}
Contact Number: ${contactNumber}
City: ${normalizedCity}`;

    for (const email of organizationEmails) {
      try {
        await sendEmail(email, subject, body);
      } catch (emailError) {
        console.error(`Failed to send request alert to ${email}:`, emailError.message);
      }
    }

    try {
      const io = getIO();
      console.log('🚨 New blood request alert emitted');
      io.emit('newBloodRequest', {
        id: bloodRequest._id,
        bloodGroup: bloodRequest.bloodGroup,
        city: bloodRequest.city,
        hospital: bloodRequest.hospital,
        unitsRequired: bloodRequest.unitsRequired,
        urgency: bloodRequest.urgency,
      });
    } catch (socketError) {
      console.warn('Socket emission skipped:', socketError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Blood request created and organizations notified',
      data: bloodRequest,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating blood request',
    });
  }
};

const getRecentRequests = async (_req, res) => {
  try {
    const recentRequests = await BloodRequest.find({})
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: recentRequests,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const getCityRequests = async (req, res) => {
  try {
    const { city } = req.params;

    const requests = await BloodRequest.find({
      city: new RegExp(`^${city}$`, 'i'),
      status: 'active',
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createBloodRequest,
  getRecentRequests,
  getCityRequests,
};
