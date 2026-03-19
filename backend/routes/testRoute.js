const express = require('express');

const router = express.Router();

/**
 * @route   GET /api/test
 * @desc    Verify API routing is operational
 * @access  Public
 */
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'LifeLink test route is working',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
