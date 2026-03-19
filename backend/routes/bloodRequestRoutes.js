const express = require('express');
const router = express.Router();
const { createBloodRequest } = require('../controllers/bloodRequestController');

router.post('/create', createBloodRequest);

module.exports = router;
