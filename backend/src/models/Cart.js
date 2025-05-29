// src/models/Cart.js - CART MODEL
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    salePrice: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    image: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + (price * item.quantity);
  }, 0);
  this.lastUpdated = new Date();
  next();
});

// Remove empty carts
cartSchema.pre('save', function(next) {
  if (this.items.length === 0) {
    this.remove();
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
