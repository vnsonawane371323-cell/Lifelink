const { v4: uuidv4 } = require('uuid');
const InviteToken = require('../models/InviteToken');

const INVITE_BASE_URL = 'http://localhost:5175/join-organization';

const generateInviteLink = async (req, res) => {
  try {
    const { organizationId } = req.body;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: 'organizationId is required',
      });
    }

    const token = uuidv4();

    await InviteToken.create({
      token,
      organizationId,
      createdBy: req.user?._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const inviteLink = `${INVITE_BASE_URL}?token=${token}`;

    return res.status(201).json({
      success: true,
      inviteLink,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while generating invite link',
    });
  }
};

const joinOrganization = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const invite = await InviteToken.findOne({ token });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite token',
      });
    }

    if (invite.used) {
      return res.status(400).json({
        success: false,
        message: 'Invite token already used',
      });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Invite token expired',
      });
    }

    invite.used = true;
    await invite.save();

    return res.status(200).json({
      success: true,
      organizationId: invite.organizationId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while joining organization',
    });
  }
};

module.exports = { generateInviteLink, joinOrganization };