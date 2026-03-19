const express = require('express');

const router = express.Router();
const {
  registerOrganization,
  loginOrganization,
  getOrganizationProfile,
  verifyInviteCode,
} = require('../controllers/organizationController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerOrganization);
router.post('/login', loginOrganization);
router.get('/invite/:code', verifyInviteCode);
router.get('/profile', authMiddleware, authorize('organization'), getOrganizationProfile);

module.exports = router;