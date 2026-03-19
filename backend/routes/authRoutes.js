// ============================================================
//  Auth Routes — LifeLink
//  POST /api/auth/register
//  POST /api/auth/login
// ============================================================

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Public routes — no token required
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
