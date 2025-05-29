// src/context/CartContext.jsx - UPDATED WITH BACKEND INTEGRATION
import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  }, [isAuthenticated]);

  // Load cart from backend
  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.get();
      
      if (response.success) {
        setCart(response.data.cart);
        console.log('✅ Cart loaded:', response.data.cart);
      }
    } catch (error) {
      console.error('❌ Load cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
 // src/context/CartContext.jsx - FIX API CALL FORMAT
const addToCart = async (product, quantity = 1, options = {}) => {
  if (!isAuthenticated) {
    alert('Please login to add items to cart');
    return { success: false, error: 'Not authenticated' };
  }

  try {
    setLoading(true);
    
    // ✅ ENSURE CORRECT DATA FORMAT
    const itemData = {
      productId: product._id || product.id, // Handle both _id and id
      quantity: parseInt(quantity),
      size: options.size,
      color: options.color
    };

    console.log('🛒 Sending to cart API:', itemData);

    const response = await cartAPI.add(itemData);
    
    if (response.success) {
      setCart(response.data.cart);
      console.log('✅ Item added to cart successfully');
      return { success: true };
    } else {
      throw new Error(response.message || 'Failed to add to cart');
    }
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};


  // Remove from cart
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      
      const response = await cartAPI.removeItem(itemId);
      
      if (response.success) {
        setCart(response.data.cart);
        console.log('✅ Item removed from cart');
      }
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      
      const response = await cartAPI.updateItem(itemId, newQuantity);
      
      if (response.success) {
        setCart(response.data.cart);
        console.log('✅ Cart item updated');
      }
    } catch (error) {
      console.error('❌ Update quantity error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.totalPrice || 0;
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.totalItems || 0;
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      
      const response = await cartAPI.clear();
      
      if (response.success) {
        setCart(response.data.cart);
        console.log('✅ Cart cleared');
      }
    } catch (error) {
      console.error('❌ Clear cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart: cart.items || [],
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemCount,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
