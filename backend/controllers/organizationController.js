const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');

const generateInviteCode = async () => {
  let isUnique = false;
  let inviteCode = '';

  while (!isUnique) {
    const randomFiveDigitNumber = Math.floor(10000 + Math.random() * 90000);
    inviteCode = `ORG${randomFiveDigitNumber}`;

    const existingOrganization = await Organization.exists({ inviteCode });
    if (!existingOrganization) {
      isUnique = true;
    }
  }

  return inviteCode;
};

const registerOrganization = async (req, res) => {
  try {
    const {
      name,
      city,
      address,
      contactNumber,
      email,
      password,
      headName,
    } = req.body;

    if (!name || !city || !contactNumber || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, city, contactNumber, email, and password',
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingOrganization = await Organization.findOne({
      email: normalizedEmail,
    });

    if (existingOrganization) {
      return res.status(409).json({
        success: false,
        message: 'Organization already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const inviteCode = await generateInviteCode();

    const organization = new Organization({
      name,
      city,
      address,
      contactNumber,
      email: normalizedEmail,
      password: hashedPassword,
      headName,
      inviteCode,
    });

    await organization.save();

    const inviteLink = `http://localhost:5173/join-org/${inviteCode}`;

    return res.status(201).json({
      success: true,
      message: 'Organization registered successfully',
      inviteLink,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const loginOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const normalizedEmail = email.toLowerCase();
    const organization = await Organization.findOne({ email: normalizedEmail });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, organization.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      {
        id: organization._id,
        email: organization.email,
        role: 'organization',
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      organization: {
        id: organization._id,
        name: organization.name,
        city: organization.city,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const getOrganizationProfile = async (req, res) => {
  try {
    const organizationId = req.user?.id || req.user?._id;
    const organization = await Organization.findById(organizationId).select('-password');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    return res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const verifyInviteCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invite code',
      });
    }

    const inviteCode = code.trim().toUpperCase();
    const organization = await Organization.findOne({ inviteCode });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code',
      });
    }

    return res.status(200).json({
      success: true,
      organization: {
        id: organization._id,
        name: organization.name,
        city: organization.city,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  registerOrganization,
  loginOrganization,
  getOrganizationProfile,
  verifyInviteCode,
};