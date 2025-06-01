// backend/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../services/emailService');

// Helper: Generate JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Request OTP for login/register
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOTP = async (req, res) => {
  try {
    const { email, firstName, lastName, name, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    // If user doesn't exist, create new user for registration
    if (!user) {
      // Use name from different possible fields
      const fullName = name || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName);
      
      if (!fullName) {
        return res.status(400).json({
          success: false,
          message: 'Name is required for registration. Please provide firstName and lastName.'
        });
      }

      user = await User.create({ 
        email: email.toLowerCase(), 
        name: fullName.trim(),
        password: password || undefined // Optional password for OTP-only signup
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // Send OTP via email
    try {
      await sendOTPEmail(user.email, otp);
      console.log(`✅ OTP sent to ${user.email}: ${otp}`); // For development
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // For development, show OTP in console if email fails
      console.log(`🔑 OTP for ${user.email}: ${otp}`);
    }

    res.json({ 
      success: true, 
      message: 'OTP sent to your email',
      data: {
        userId: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Error in requestOTP:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// @desc    Verify OTP (login/register)
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isEmailVerified = true;
    await user.save();

    const token = generateToken(user._id, user.role);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          addresses: user.addresses
        },
        token
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
};

// Rest of your functions remain the same...
exports.adminLogin = async (req, res) => {
  // ... existing code
};

exports.getMe = async (req, res) => {
  // ... existing code
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
