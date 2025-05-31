// backend/src/routes/test.js

const express = require('express');
const router = express.Router();

// @route   GET /api/test
// @desc    Test route to verify API is working
// @access  Public
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Test route is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

module.exports = router;
