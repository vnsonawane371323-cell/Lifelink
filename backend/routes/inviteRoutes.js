const express = require('express');

const router = express.Router();
const { generateInviteLink, joinOrganization } = require('../controllers/inviteController');

router.post('/generate', generateInviteLink);
router.post('/join', joinOrganization);

module.exports = router;