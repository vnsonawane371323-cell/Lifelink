const express = require('express');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

/**
 * @route   GET /api/test-email
 * @desc    Send a test email to verify SendGrid integration
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const to = req.query.to || process.env.EMAIL_FROM;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required. Provide ?to=email@example.com or set EMAIL_FROM.',
      });
    }

    const result = await sendEmail(
      to,
      'LifeLink Email Test',
      'SendGrid integration successful.'
    );

    return res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Test email failed',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
    });
  }
});

module.exports = router;