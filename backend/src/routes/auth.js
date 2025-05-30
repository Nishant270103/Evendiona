// backend/src/routes/auth.js

const express = require('express');
const router = express.Router();
const {
  requestOTP,
  verifyOTP,
  adminLogin,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/request-otp
// @desc    Send OTP to user's email for login/register
// @access  Public
router.post('/request-otp', requestOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and log in/register user
// @access  Public
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/admin-login
// @desc    Admin login with email and password
// @access  Public
router.post('/admin-login', adminLogin);

// @route   GET /api/auth/me
// @desc    Get current authenticated user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user (client should just delete token)
// @access  Private
router.post('/logout', protect, logout);

module.exports = router;
