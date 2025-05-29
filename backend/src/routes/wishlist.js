// routes/wishlist.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Wishlist = require('../models/Wishlist'); // or add wishlist array to User model

// Get wishlist
router.get('/', protect, async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
  res.json({ success: true, data: wishlist ? wishlist.products : [] });
});

// Add to wishlist
router.post('/:productId', protect, async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  if (!wishlist.products.includes(req.params.productId)) {
    wishlist.products.push(req.params.productId);
    await wishlist.save();
  }
  res.json({ success: true });
});

// Remove from wishlist
router.delete('/:productId', protect, async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (pid) => pid.toString() !== req.params.productId
    );
    await wishlist.save();
  }
  res.json({ success: true });
});

module.exports = router;
