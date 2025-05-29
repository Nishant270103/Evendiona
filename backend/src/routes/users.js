// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth'); // JWT auth

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate('orders');
  res.json(user);
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone },
    { new: true }
  );
  res.json(user);
});

// Change password
router.put('/profile/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ error: "Old password incorrect" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ success: true });
});

// Address book: Add address
router.post('/addresses', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.push(req.body);
  await user.save();
  res.json(user.addresses);
});

// Address book: Edit address
router.put('/addresses/:addressId', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);
  Object.assign(address, req.body);
  await user.save();
  res.json(user.addresses);
});

// Address book: Delete address
router.delete('/addresses/:addressId', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.id(req.params.addressId).remove();
  await user.save();
  res.json(user.addresses);
});

module.exports = router;
