// backend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- SECURITY & MIDDLEWARE -------------------

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { 
    success: false, 
    message: 'Too many requests from this IP, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------- DATABASE CONNECTION -------------------

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/evendiona',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// ------------------- ROUTES -------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Evendiona Backend is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
try {
  app.use('/api/auth', require('./src/routes/auth'));
  app.use('/api/products', require('./src/routes/products'));
  app.use('/api/cart', require('./src/routes/cart'));
  app.use('/api/orders', require('./src/routes/order'));
  app.use('/api/users', require('./src/routes/users'));
  app.use('/api/wishlist', require('./src/routes/wishlist'));
  app.use('/api/upload', require('./src/routes/upload'));
} catch (error) {
  console.error('❌ Route loading error:', error.message);
  process.exit(1);
}

<<<<<<< HEAD
// ------------------- ERROR HANDLING -------------------

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found', 
    path: req.originalUrl,
    method: req.method
  });
=======
app.post('/api/auth/google-login', async (req, res) => {
  const token = req.body.token || req.body.credential; // accept either field

  if (!token) {
    console.error('❌ Token is missing in the request body');
    return res.status(400).json({ success: false, message: 'Token is missing' });
  }

  console.log('📥 Received token:', token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Use your correct Google client ID
    });

    const payload = ticket.getPayload();
    console.log('✅ Google user info:', payload);

    const userEmail = payload.email;
    const userName = payload.name;

    // Check if user exists or create a new user
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log('ℹ️ User not found, creating a new user');
      user = await User.create({
        name: userName,
        email: userEmail,
        isEmailVerified: true,
        isActive: true,
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    console.log('✅ JWT token generated:', jwtToken);

    res.json({
      success: true,
      message: 'User authenticated',
      data: {
        user: {
          id: user._id,
          name: userName,
          email: userEmail,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token: jwtToken
      }
    });
  } catch (error) {
    console.error('❌ Google authentication error:', error);
    res.status(400).json({ success: false, message: 'Invalid token or authentication failed' });
  }
>>>>>>> ab36fdd14e4f7c104a788cfb80e7e83c39601579
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// ------------------- START SERVER -------------------

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
    mongoose.connection.close();
  });
});

module.exports = app;
