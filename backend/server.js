// server.js - COMPLETE ECOMMERCE BACKEND WITH EMAIL INTEGRATION
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });



// server.js (place this above your routes)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Accept both "Bearer <token>" and "<token>"
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', async (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'User not found or inactive' });
    }
    req.user = user;
    next();
  });
};


const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};



app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Add COOP header
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Add COEP header
  next();
});



// ✅ SECURITY MIDDLEWARE
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// ✅ DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://evendiona:M6lGrqd4YnM2ILYo@evendiona.hbw3otn.mongodb.net/evendiona')
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ EMAIL SERVICE INTEGRATION
// server.js - ADD DETAILED ERROR LOGGING
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    console.log('📥 Register request received:', { 
      firstName, 
      lastName, 
      email,
      hasPassword: !!password,
      hasConfirmPassword: !!confirmPassword
    });
    
    // Detailed validation with logging
    if (!firstName || !lastName || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    if (password !== confirmPassword) {
      console.log('❌ Validation failed: Passwords do not match');
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }
    
    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    console.log('✅ Validation passed, checking existing user...');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log('🔍 Existing user check result:', !!existingUser);
    
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        console.log('❌ User already exists and verified');
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists with this email' 
        });
      } else {
        console.log('🔄 User exists but not verified, resending OTP...');
        // Resend OTP logic here
      }
    }

    console.log('🔐 Generating OTP...');
    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('✅ OTP generated:', otp);

    console.log('👤 Creating new user...');
    // Create user
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      password,
      emailVerificationOTP: otp,
      otpExpiresAt,
      isEmailVerified: false,
      isActive: false
    });
    console.log('✅ User created with ID:', user._id);

    console.log('📧 Sending OTP email...');
    // Send OTP email
    try {
      await sendOTPEmail(user, otp);
      console.log('✅ OTP email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError);
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification email' 
      });
    }

    console.log('🎉 Registration completed successfully');

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      data: {
        userId: user._id,
        email: user.email,
        requiresVerification: true
      }
    });

  } catch (error) {
    console.error('❌ DETAILED REGISTRATION ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    if (error.code === 11000) {
      console.log('❌ Duplicate key error');
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// server.js (or routes/admin.js)
app.get('/api/admin/analytics', async (req, res) => {
  try {
    // You can enhance these queries as per your schema
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const conversionRate = 3.2; // Example: calculate as needed

    // Revenue trend (last 7 days)
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    const revenueTrend = await Promise.all(days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      const dayRevenueAgg = await Order.aggregate([
        { $match: { createdAt: { $gte: date, $lt: nextDay } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]);
      return dayRevenueAgg[0]?.total || 0;
    }));

    // Category sales (mocked, replace with your logic)
    const categorySales = [
      { label: 'T-Shirts', value: 45 },
      { label: 'Casual', value: 32 },
      { label: 'Premium', value: 28 },
      { label: 'Limited Edition', value: 15 }
    ];

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        conversionRate,
        revenueTrend,
        categorySales
      }
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Wishlist schema (after User/Product)
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Get current user's wishlist
app.get('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json({ success: true, data: wishlist.products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Add product to wishlist
app.post('/api/wishlist/:productId', authenticateToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    if (!wishlist.products.includes(req.params.productId)) {
      wishlist.products.push(req.params.productId);
      await wishlist.save();
    }
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove product from wishlist
app.delete('/api/wishlist/:productId', authenticateToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        pid => pid.toString() !== req.params.productId
      );
      await wishlist.save();
    }
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add after your existing product routes in server.js

// Advanced product search and filter
app.get('/api/products/search', async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build query object
    let query = { status: 'active' }; // Only show active products
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== '') {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortObj = {};
    switch (sortBy) {
      case 'price':
        sortObj.price = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'name':
        sortObj.name = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'popularity':
        sortObj.soldCount = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'newest':
      default:
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
        break;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / Number(limit));

    // Get filter metadata
    const categories = await Product.distinct('category', { status: 'active' });
    const priceRange = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { 
          _id: null, 
          minPrice: { $min: '$price' }, 
          maxPrice: { $max: '$price' } 
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        },
        filters: {
          categories,
          priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 }
        }
      }
    });

  } catch (error) {
    console.error('❌ Product search error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get filter options (categories, price range)
app.get('/api/products/filters', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    const priceRange = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { 
          _id: null, 
          minPrice: { $min: '$price' }, 
          maxPrice: { $max: '$price' } 
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 }
      }
    });
  } catch (error) {
    console.error('❌ Get filters error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// server.js or routes/admin.js

// Get all products
app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('❌ Get all products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Add a product
// server.js
app.post('/api/admin/products', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price, stock, status } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const product = await Product.create({ name, description, category, price, stock, status, image: imageUrl });
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




// Update a product
app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Delete a product
app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  const orders = await Order.find().populate('user');
  res.json({ success: true, data: orders });
});

app.get('/api/admin/customers', authenticateToken, requireAdmin, async (req, res) => {
  const customers = await User.find({ role: 'user' });
  res.json({ success: true, data: customers });
});

app.get('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  const admin = await User.findById(req.user.userId);
  res.json({ success: true, data: admin });
});

app.put('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  const admin = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
  res.json({ success: true, data: admin });
});


const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createTransporter();
    
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Evendiona <noreply@evendiona.com>',
      to: user.email,
      subject: `Order Confirmed! #${order.orderNumber} - Evendiona`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
                .content { background: white; padding: 30px 20px; }
                .order-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .button { background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Confirmed! 🎉</h1>
                    <p>Thank you for your purchase, ${user.name}!</p>
                </div>
                <div class="content">
                    <p>Hi ${user.name},</p>
                    <p>Your order has been confirmed and we're preparing it for shipment.</p>
                    
                    <div class="order-info">
                        <h3>Order Information</h3>
                        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                        <p><strong>Order Date:</strong> ${orderDate}</p>
                        <p><strong>Total:</strong> ₹${order.pricing.total.toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> ${order.paymentInfo.method.toUpperCase()}</p>
                    </div>

                    <h3>Order Items</h3>
                    ${order.items.map(item => `
                        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                            <strong>${item.name}</strong><br>
                            Size: ${item.size} • Color: ${item.color} • Qty: ${item.quantity}<br>
                            Price: ₹${(item.price * item.quantity).toLocaleString()}
                        </div>
                    `).join('')}

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" class="button">
                            Track Your Order
                        </a>
                    </div>

                    <p>Thank you for choosing Evendiona!</p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Hi ${user.name},
        
        Thank you for your order! Your order #${order.orderNumber} has been confirmed.
        
        Order Total: ₹${order.pricing.total.toLocaleString()}
        
        Track your order: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders
        
        Thank you for choosing Evendiona!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Evendiona <noreply@evendiona.com>',
      to: user.email,
      subject: 'Welcome to Evendiona! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
                .content { background: white; padding: 30px 20px; }
                .button { background: #1f2937; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Evendiona! 🎉</h1>
                </div>
                <div class="content">
                    <p>Hi ${user.name},</p>
                    <p>Welcome to Evendiona! We're excited to have you as part of our community.</p>
                    <p>Discover our premium collection of T-shirts designed for comfort, style, and quality.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/collection" class="button">
                            Shop Collection
                        </a>
                    </div>
                    <p>Happy shopping!<br>The Evendiona Team</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// ✅ SCHEMAS
// server.js - UPDATED USER SCHEMA WITH OTP
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: String,
  
  // ✅ OTP VERIFICATION FIELDS
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationOTP: { type: String },
  otpExpiresAt: { type: Date },
  otpAttempts: { type: Number, default: 0 },
  
  // Account status
  isActive: { type: Boolean, default: false }, // Only active after email verification
  lastLoginAt: Date,
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);


const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: [100, 'Product name cannot exceed 100 characters'] },
  description: { type: String, required: [true, 'Product description is required'], maxlength: [2000, 'Description cannot exceed 2000 characters'] },
  price: { type: Number, required: [true, 'Product price is required'], min: [0, 'Price cannot be negative'] },
  salePrice: { type: Number, min: [0, 'Sale price cannot be negative'] },
  category: { type: String, required: [true, 'Product category is required'], enum: ['t-shirts', 'casual', 'premium', 'limited-edition'] },
  sizes: [{
    size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
    stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'] }
  }],
  colors: [{ color: String, colorCode: String, images: [String] }],
  images: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    salePrice: Number,
    quantity: { type: Number, required: true, min: 1, default: 1 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    image: String,
    addedAt: { type: Date, default: Date.now }
  }],
  totalItems: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + (price * item.quantity);
  }, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    size: String,
    color: String,
    image: String
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    street: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  paymentInfo: {
    method: { type: String, enum: ['card', 'upi', 'cod', 'wallet'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paidAt: Date
  },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'pending' },
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  notes: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await this.constructor.countDocuments();
      this.orderNumber = `EVN-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date()
    });
  }
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

// ✅ MIDDLEWARE


// ✅ ROUTES

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Evendiona Backend is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ AUTHENTICATION ROUTES
// ✅ NEW REGISTRATION FLOW WITH OTP
// server.js - ADD DETAILED ERROR LOGGING

// Add these functions AFTER your schemas and BEFORE your routes
const nodemailer = require('nodemailer');

// ✅ MISSING FUNCTION 1: generateOTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ MISSING FUNCTION 2: createTransporter  
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ✅ MISSING FUNCTION 3: sendOTPEmail
const sendOTPEmail = async (user, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Evendiona <noreply@evendiona.com>',
      to: user.email,
      subject: 'Email Verification - Evendiona',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1f2937; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>Email Verification 📧</h1>
          </div>
          <div style="background: white; padding: 30px 20px; border: 1px solid #e5e7eb;">
            <p>Hi ${user.name},</p>
            <p>Your verification code is:</p>
            <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 8px;">${otp}</div>
              <p style="color: #6b7280; font-size: 14px;">Expires in 10 minutes</p>
            </div>
            <p>If you didn't create an account, ignore this email.</p>
          </div>
        </div>
      `,
      text: `Hi ${user.name}, Your verification code: ${otp}. Expires in 10 minutes.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};



app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    console.log('📥 Register request received:', { 
      firstName, 
      lastName, 
      email,
      hasPassword: !!password,
      hasConfirmPassword: !!confirmPassword
    });
    
    // Detailed validation with logging
    if (!firstName || !lastName || !email || !password) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    if (password !== confirmPassword) {
      console.log('❌ Validation failed: Passwords do not match');
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }
    
    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    console.log('✅ Validation passed, checking existing user...');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    console.log('🔍 Existing user check result:', !!existingUser);
    
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        console.log('❌ User already exists and verified');
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists with this email' 
        });
      } else {
        console.log('🔄 User exists but not verified, resending OTP...');
        // Resend OTP logic here
      }
    }

    console.log('🔐 Generating OTP...');
    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('✅ OTP generated:', otp);

    console.log('👤 Creating new user...');
    // Create user
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      password,
      emailVerificationOTP: otp,
      otpExpiresAt,
      isEmailVerified: false,
      isActive: false
    });
    console.log('✅ User created with ID:', user._id);

    console.log('📧 Sending OTP email...');
    // Send OTP email
    try {
      await sendOTPEmail(user, otp);
      console.log('✅ OTP email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError);
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification email' 
      });
    }

    console.log('🎉 Registration completed successfully');

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      data: {
        userId: user._id,
        email: user.email,
        requiresVerification: true
      }
    });

  } catch (error) {
    console.error('❌ DETAILED REGISTRATION ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    if (error.code === 11000) {
      console.log('❌ Duplicate key error');
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// server.js - ADD ROUTE TO CHECK USER ROLE
app.get('/api/check-user-role/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// server.js - ADD ROUTE TO MAKE USER ADMIN
// server.js - ADD THIS ROUTE BEFORE YOUR CATCH-ALL ROUTE
app.patch('/api/make-admin/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log('👑 Making user admin:', email);
    
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    console.log('✅ User role updated to admin:', user.email);
    
    res.json({
      success: true,
      message: 'User role updated to admin successfully',
      data: { 
        user: { 
          id: user._id,
          name: user.name,
          email: user.email, 
          role: user.role 
        } 
      }
    });
  } catch (error) {
    console.error('❌ Make admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});



// server.js - ADD GOOGLE LOGIN ROUTE
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // Use your client ID

// Validate GOOGLE_CLIENT_ID environment variable
if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn('⚠️ GOOGLE_CLIENT_ID is not set in the environment variables. Google login may not work correctly.');
}

app.post('/api/auth/google-login', async (req, res) => {
  const { token } = req.body; // Ensure the 'token' field is being received

  if (!token) {
    console.error('❌ Token is missing in the request body');
    return res.status(400).json({ error: 'Token is missing' });
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
      message: 'User authenticated',
      userEmail,
      userName,
      token: jwtToken,
    });
  } catch (error) {
    console.error('❌ Google authentication error:', error);
    res.status(400).json({ error: 'Invalid token or authentication failed' });
  }
});

// Add CORS headers to handle Cross-Origin policies
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


// Admin Login
// server.js
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not an admin' });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Admin Dashboard Data
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { range = '7days' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const daysBack = range === '7days' ? 7 : range === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Get statistics
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: startDate } });
    const totalRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    const totalCustomers = await User.countDocuments({ 
      createdAt: { $gte: startDate },
      role: 'user'
    });

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders,
        totalCustomers,
        conversionRate: 3.2,
        recentOrders: [], // Add recent orders query
        topProducts: [] // Add top products query
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// ✅ OTP VERIFICATION ROUTE
// server.js - UPDATE OTP VERIFICATION ROUTE FOR AUTO LOGIN
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    console.log('📥 OTP verification request:', { userId, otp });
    
    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({ 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      });
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
    }

    if (user.emailVerificationOTP !== otp) {
      user.otpAttempts += 1;
      await user.save();
      
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${5 - user.otpAttempts} attempts remaining.` 
      });
    }

    // ✅ OTP VERIFIED - AUTO LOGIN USER
    user.isEmailVerified = true;
    user.isActive = true;
    user.emailVerificationOTP = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    user.lastLoginAt = new Date(); // ✅ Set login time
    await user.save();

    // ✅ GENERATE JWT TOKEN FOR AUTO LOGIN
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
    }

    console.log('✅ Email verified and user auto-logged in:', user.email);

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to Evendiona!',
      data: {
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token, // ✅ TOKEN FOR AUTO LOGIN
        autoLogin: true // ✅ FLAG TO INDICATE AUTO LOGIN
      }
    });

  } catch (error) {
    console.error('❌ OTP verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});


// ✅ RESEND OTP ROUTE
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log('📥 Resend OTP request:', { userId });
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationOTP = otp;
    user.otpExpiresAt = otpExpiresAt;
    user.otpAttempts = 0; // Reset attempts
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(user, otp);
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError);
      return res.status(500).json({ success: false, message: 'Failed to send verification email' });
    }

    console.log('✅ New OTP sent:', user.email);

    res.json({
      success: true,
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// ✅ UPDATED LOGIN WITH EMAIL VERIFICATION CHECK
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('📥 Login request:', { email });
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email address first',
        data: { 
          userId: user._id,
          requiresVerification: true 
        }
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    console.log('✅ Login successful:', user.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});


app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }
      }
    });
  } catch (error) {
    console.error('❌ Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/auth/make-admin/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`👑 Making user admin: ${email}`);
    
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log('✅ User role updated to admin:', user.email);
    
    res.json({
      success: true,
      message: 'User role updated to admin successfully',
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } }
    });
  } catch (error) {
    console.error('❌ Make admin error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, featured, page = 1, limit = 12, sort = 'newest' } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;

    let sortOption = {};
    switch (sort) {
      case 'price-low': sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { 'rating.average': -1 }; break;
      case 'popular': sortOption = { 'rating.count': -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(query);

    console.log(`📦 Found ${products.length} products`);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`📦 Getting product: ${productId}`);
    
    const product = await Product.findById(productId);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: { product } });
  } catch (error) {
    console.error('❌ Get product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/products/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true }).limit(8).sort({ createdAt: -1 });
    res.json({ success: true, data: { products } });
  } catch (error) {
    console.error('❌ Get featured products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📦 Creating product:', req.body.name);
    const product = await Product.create(req.body);
    console.log('✅ Product created successfully:', product.name);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/products/:productId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`📦 Updating product: ${productId}`);
    
    const product = await Product.findByIdAndUpdate(productId, req.body, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log('✅ Product updated successfully:', product.name);
    res.json({ success: true, message: 'Product updated successfully', data: { product } });
  } catch (error) {
    console.error('❌ Update product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/products/:productId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`📦 Deleting product: ${productId}`);
    
    const product = await Product.findByIdAndUpdate(productId, { isActive: false }, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log('✅ Product deleted successfully:', product.name);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ CART ROUTES
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price salePrice images isActive');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    await cart.save();

    console.log(`🛒 Cart retrieved for user: ${req.user.email}`);
    res.json({ success: true, data: { cart } });
  } catch (error) {
    console.error('❌ Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    console.log('🛒 Adding to cart:', { productId, quantity, size, color, user: req.user.email });

    if (!productId || !size || !color) {
      return res.status(400).json({ success: false, message: 'Product ID, size, and color are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    const sizeOption = product.sizes.find(s => s.size === size);
    if (!sizeOption) {
      return res.status(400).json({ success: false, message: 'Selected size is not available' });
    }

    if (sizeOption.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${sizeOption.stock} items available in stock` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > sizeOption.stock) {
        return res.status(400).json({ success: false, message: `Cannot add more items. Only ${sizeOption.stock} available in stock` });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        quantity,
        size,
        color,
        image: product.images && product.images.length > 0 ? product.images[0] : null
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price salePrice images isActive');

    console.log('✅ Item added to cart:', product.name);
    res.json({ success: true, message: 'Item added to cart successfully', data: { cart } });
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/cart/item/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    console.log(`🛒 Updating cart item: ${itemId}, quantity: ${quantity}`);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const cartItem = cart.items[itemIndex];
    const product = await Product.findById(cartItem.product);
    
    if (!product || !product.isActive) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(404).json({ success: false, message: 'Product is no longer available' });
    }

    const sizeOption = product.sizes.find(s => s.size === cartItem.size);
    if (!sizeOption || sizeOption.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${sizeOption ? sizeOption.stock : 0} items available in stock` });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name price salePrice images isActive');

    console.log('✅ Cart item updated successfully');
    res.json({ success: true, message: 'Cart item updated successfully', data: { cart } });
  } catch (error) {
    console.error('❌ Update cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/cart/item/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(`🛒 Removing item from cart: ${itemId}`);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.product', 'name price salePrice images isActive');

    console.log('✅ Item removed from cart successfully');
    res.json({ success: true, message: 'Item removed from cart successfully', data: { cart } });
  } catch (error) {
    console.error('❌ Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    console.log(`🛒 Clearing cart for user: ${req.user.email}`);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    console.log('✅ Cart cleared successfully');
    res.json({ success: true, message: 'Cart cleared successfully', data: { cart } });
  } catch (error) {
    console.error('❌ Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ ORDER ROUTES
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items } = req.body;

    console.log('📦 Creating order for user:', req.user.email);

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Shipping address and payment method are required' });
    }

    let orderItems = [];

    if (items && items.length > 0) {
      orderItems = items;
    } else {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price salePrice images');

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      orderItems = cart.items;
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product._id || item.product);
      
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${item.name || 'unknown'} is no longer available` });
      }

      const sizeOption = product.sizes.find(s => s.size === item.size);
      if (!sizeOption || sizeOption.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name} (${item.size})` });
      }

      const itemPrice = product.salePrice || product.price;
      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images && product.images.length > 0 ? product.images[0] : null
      });
    }

    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + tax + shipping;

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentInfo: { method: paymentMethod, status: paymentMethod === 'cod' ? 'pending' : 'pending' },
      pricing: { subtotal, tax, shipping, total }
    });

    // Update product stock
    for (const item of validatedItems) {
      const product = await Product.findById(item.product);
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      if (sizeIndex > -1) {
        product.sizes[sizeIndex].stock -= item.quantity;
        await product.save();
      }
    }

    // Clear cart if items came from cart
    if (!items || items.length === 0) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(order, req.user);
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError);
    }

    console.log('✅ Order created successfully:', order.orderNumber);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user._id };
    if (status) query.orderStatus = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(query);

    console.log(`📦 Found ${orders.length} orders for user: ${req.user.email}`);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this order' });
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    console.error('❌ Get order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/orders/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex > -1) {
          product.sizes[sizeIndex].stock += item.quantity;
          await product.save();
        }
      }
    }

    console.log('✅ Order cancelled successfully:', order.orderNumber);
    res.json({ success: true, message: 'Order cancelled successfully', data: { order } });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin order routes
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    let query = {};
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/admin/orders/:orderId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentInfo.status = 'completed';
    }

    if (note) {
      order.statusHistory[order.statusHistory.length - 1].note = note;
    }

    await order.save();

    console.log('✅ Order status updated:', order.orderNumber, 'to', status);
    res.json({ success: true, message: 'Order status updated successfully', data: { order } });
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ ERROR HANDLING
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', path: req.originalUrl });
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Email Service: ${process.env.EMAIL_USER ? 'Configured' : 'Not Configured'}`);
});

module.exports = app;
