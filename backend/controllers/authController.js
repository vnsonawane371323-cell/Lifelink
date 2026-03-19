// ============================================================
//  Auth Controller — LifeLink
//  Handles user registration and login
// ============================================================

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ----------------------------------------------------------------
//  @route   POST /api/auth/register
//  @desc    Register a new user and return JWT
//  @access  Public
// ----------------------------------------------------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // --- Validation ---------------------------------------------------
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // --- Check for duplicate email ------------------------------------
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // --- Create user (password is hashed via pre-save hook) -----------
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'donor',
    });

    // --- Respond with token -------------------------------------------
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// ----------------------------------------------------------------
//  @route   POST /api/auth/login
//  @desc    Authenticate user and return JWT
//  @access  Public
// ----------------------------------------------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---------------------------------------------------
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // --- Find user (explicitly select password) -----------------------
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // --- Compare password ---------------------------------------------
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // --- Return token -------------------------------------------------
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

module.exports = { registerUser, loginUser };
