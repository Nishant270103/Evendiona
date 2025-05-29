// models/User.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: String,
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String, // hashed
  addresses: [addressSchema],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

module.exports = mongoose.model('User', userSchema);
