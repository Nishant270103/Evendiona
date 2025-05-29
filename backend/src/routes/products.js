// src/routes/products.js - PRODUCT ROUTES
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
// @desc    Get all products with filtering, sorting, pagination
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProduct);

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

// @route   GET /api/products/:id/reviews
// @desc    Get product reviews
// @access  Public
router.get('/:id/reviews', getProductReviews);

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', protect, addProductReview);

module.exports = router;
