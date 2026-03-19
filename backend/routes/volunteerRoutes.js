const express = require('express');

const router = express.Router();
const { joinOrganization } = require('../controllers/volunteerController');

router.post('/join', joinOrganization);

module.exports = router;