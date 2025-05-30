// backend/src/routes/cart.js

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
// @desc    Get the current user's cart
// @access  Private
router.get('/', getCart);

// @route   POST /api/cart/add
// @desc    Add an item to the cart
// @access  Private
router.post('/add', addToCart);

// @route   PUT /api/cart/item/:itemId
// @desc    Update the quantity of a cart item
// @access  Private
router.put('/item/:itemId', updateCartItem);

// @route   DELETE /api/cart/item/:itemId
// @desc    Remove an item from the cart
// @access  Private
router.delete('/item/:itemId', removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear the entire cart
// @access  Private
router.delete('/', clearCart);

module.exports = router;
