// src/controllers/cartController.js - CART CONTROLLER
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price salePrice images isActive');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    
    if (cart.isModified('items')) {
      await cart.save();
    }

    res.json({
      success: true,
      data: { cart }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    // Validation
    if (!productId || !size || !color) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, size, and color are required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check if size is available
    const sizeOption = product.sizes.find(s => s.size === size);
    if (!sizeOption) {
      return res.status(400).json({
        success: false,
        message: 'Selected size is not available'
      });
    }

    // Check if color is available
    const colorOption = product.colors.find(c => c.color.toLowerCase() === color.toLowerCase());
    if (!colorOption) {
      return res.status(400).json({
        success: false,
        message: 'Selected color is not available'
      });
    }

    // Check stock
    if (sizeOption.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${sizeOption.stock} items available in stock`
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => 
        item.product.toString() === productId &&
        item.size === size &&
        item.color.toLowerCase() === color.toLowerCase()
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > sizeOption.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${sizeOption.stock} available in stock`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      const newItem = {
        product: productId,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        quantity,
        size,
        color,
        image: product.images && product.images.length > 0 ? product.images[0].url : null
      };

      cart.items.push(newItem);
    }

    await cart.save();

    // Populate cart for response
    await cart.populate('items.product', 'name price salePrice images isActive');

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cart }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    const cartItem = cart.items[itemIndex];
    
    // Check product and stock
    const product = await Product.findById(cartItem.product);
    if (!product || !product.isActive) {
      // Remove item if product is no longer available
      cart.items.splice(itemIndex, 1);
      await cart.save();
      
      return res.status(404).json({
        success: false,
        message: 'Product is no longer available'
      });
    }

    const sizeOption = product.sizes.find(s => s.size === cartItem.size);
    if (!sizeOption || sizeOption.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${sizeOption ? sizeOption.stock : 0} items available in stock`
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate cart for response
    await cart.populate('items.product', 'name price salePrice images isActive');

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: { cart }
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Populate cart for response
    await cart.populate('items.product', 'name price salePrice images isActive');

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: { cart }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { cart }
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
