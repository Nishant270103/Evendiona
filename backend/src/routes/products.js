// backend/src/routes/products.js

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  addProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    List all products with filtering, sorting, and pagination
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id/reviews
// @desc    Get all reviews for a product
// @access  Public
router.get('/:id/reviews', getProductReviews);

// @route   POST /api/products/:id/reviews
// @desc    Add a review to a product (logged-in users)
// @access  Private
router.post('/:id/reviews', protect, addProductReview);

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', getProduct);

// @route   POST /api/products
// @desc    Create a new product (admin only)
// @access  Private/Admin
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Soft delete a product (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
