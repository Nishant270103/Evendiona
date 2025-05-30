// backend/src/controllers/orderController.js

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items } = req.body;
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Shipping address and payment method are required' });
    }

    let orderItems = [];
    if (items && items.length > 0) {
      orderItems = items;
    } else {
      const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price salePrice images');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }
      orderItems = cart.items;
    }

    let subtotal = 0;
    const validatedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id || item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${item.name || 'unknown'} is no longer available` });
      }
      const sizeOption = product.sizes.find(s => s.size === item.size);
      if (!sizeOption || sizeOption.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name} (${item.size})` });
      }
      const itemPrice = product.salePrice || product.price;
      subtotal += itemPrice * item.quantity;
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images && product.images.length > 0 ? product.images[0].url : null
      });
    }

    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + tax + shipping;

    const order = await Order.create({
      user: req.user.id,
      items: validatedItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      pricing: { subtotal, tax, shipping, total }
    });

    // Update product stock
    for (const item of validatedItems) {
      const product = await Product.findById(item.product);
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      if (sizeIndex > -1) {
        product.sizes[sizeIndex].stock -= item.quantity;
        product.soldCount += item.quantity;
        await product.save();
      }
    }

    // Clear cart if items came from cart
    if (!items || items.length === 0) {
      await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    }

    await order.populate('user', 'name email');
    res.status(201).json({ success: true, message: 'Order created successfully', data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's orders
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-statusHistory');
    const total = await Order.countDocuments({ user: req.user.id });
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this order' });
    }
    res.json({ success: true, data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex > -1) {
          product.sizes[sizeIndex].stock += item.quantity;
          product.soldCount -= item.quantity;
          await product.save();
        }
      }
    }

    res.json({ success: true, message: 'Order cancelled successfully', data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    let query = {};
    if (req.query.status) query.orderStatus = req.query.status;
    if (req.query.paymentStatus) query['paymentInfo.status'] = req.query.paymentStatus;
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Order.countDocuments(query);
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, trackingUrl, note } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.orderStatus = status;
    if (status === 'shipped' && trackingNumber) {
      order.tracking.trackingNumber = trackingNumber;
      order.tracking.trackingUrl = trackingUrl;
    }
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentInfo.status = 'completed';
    }
    if (note) {
      order.statusHistory[order.statusHistory.length - 1].note = note;
    }
    await order.save();
    res.json({ success: true, message: 'Order status updated successfully', data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber user pricing.total orderStatus createdAt');
    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
