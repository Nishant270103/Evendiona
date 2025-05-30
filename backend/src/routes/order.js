// backend/src/routes/order.js

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');

const ajmerCODPinCodes = [
  "305001", "305002", "305003", "305004", "305005", "305007", "305008", "305025"
];

// All order routes require authentication
router.use(protect);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get('/admin/all', admin, getAllOrders);

// @route   GET /api/orders/admin/stats
// @desc    Get order statistics (admin)
// @access  Private/Admin
router.get('/admin/stats', admin, getOrderStats);

// @route   POST /api/orders/:id/cancel
// @desc    Cancel an order (user only)
// @access  Private
router.post('/:id/cancel', cancelOrder);

// @route   PATCH /api/orders/:id/status
// @desc    Update order status (admin)
// @access  Private/Admin
router.patch('/:id/status', admin, updateOrderStatus);

// @route   GET /api/orders/:id
// @desc    Get a specific order by ID (user or admin)
// @access  Private
router.get('/:id', getOrder);

// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
// @access  Private
router.get('/', getOrders);

// @route   POST /api/orders
// @desc    Create a new order (COD allowed only for select Ajmer pincodes)
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;
    const pincode = shippingAddress?.zipCode || shippingAddress?.pincode;

    // COD allowed only for Ajmer pin codes
    if (paymentMethod === 'cod' && !ajmerCODPinCodes.includes(pincode)) {
      return res.status(400).json({
        success: false,
        message: "COD is only available for select Ajmer pincodes. Please pay online."
      });
    }

    // Forward to main controller logic
    return createOrder(req, res, next);
  } catch (error) {
    console.error('Order create error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

module.exports = router;
