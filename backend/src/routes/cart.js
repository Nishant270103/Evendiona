// src/routes/cart.js - CART ROUTES
const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', getCart);

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', addToCart);

// @route   PUT /api/cart/item/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/item/:itemId', updateCartItem);

// @route   DELETE /api/cart/item/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/item/:itemId', removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', clearCart);

module.exports = router;
