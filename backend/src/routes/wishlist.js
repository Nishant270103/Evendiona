// backend/src/routes/wishlist.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');

// All wishlist routes require authentication
router.use(protect);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id || req.user.id })
      .populate('products');
    res.json({
      success: true,
      data: wishlist ? wishlist.products : []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/wishlist/:productId
// @desc    Add a product to wishlist
// @access  Private
router.post('/:productId', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id || req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id || req.user.id, products: [] });
    }
    const productId = req.params.productId;
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    res.json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove a product from wishlist
// @access  Private
router.delete('/:productId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id || req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        pid => pid.toString() !== req.params.productId
      );
      await wishlist.save();
    }
    res.json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
