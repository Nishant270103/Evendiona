// backend/src/models/Product.js

const mongoose = require('mongoose');

// Size schema
const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative']
  }
}, { _id: false });

// Color schema
const colorSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorCode: { type: String, required: true },
  images: [{ type: String }]
}, { _id: false });

// Image schema
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

// Review schema
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

// Main Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    validate: {
      validator: function(value) {
        return value == null || value < this.price;
      },
      message: 'Sale price must be less than regular price'
    }
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['t-shirts', 'casual', 'premium', 'limited-edition']
  },
  sizes: [sizeSchema],
  colors: [colorSchema],
  images: [imageSchema],
  material: {
    type: String,
    default: '100% Cotton'
  },
  care: {
    type: String,
    default: 'Machine wash cold, tumble dry low'
  },
  features: [String],
  tags: [String],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [reviewSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  totalStock: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-calculate total stock from sizes before saving
productSchema.pre('save', function(next) {
  if (Array.isArray(this.sizes)) {
    this.totalStock = this.sizes.reduce((sum, sz) => sum + (sz.stock || 0), 0);
  } else {
    this.totalStock = 0;
  }
  next();
});

// Update rating when reviews change
productSchema.methods.updateRating = function() {
  if (Array.isArray(this.reviews) && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
};

module.exports = mongoose.model('Product', productSchema);
