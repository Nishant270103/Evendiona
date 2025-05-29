const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Order = require('../models/Order'); // Adjust path as per your project

const ajmerCODPinCodes = [
  "305001", "305002", "305003", "305004", "305005", "305007", "305008", "305025"
];

// User must be authenticated for all order routes
router.use(protect);

// Create new order
router.post('/', async (req, res) => {
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

    // ...rest of your order creation logic...
    // Example:
    const order = await Order.create({
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      // ...other fields from req.body...
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Order create error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// ...rest of your routes (getOrders, getOrder, etc.)...

module.exports = router;
