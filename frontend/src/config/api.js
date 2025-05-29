// src/config/api.js - CREATE THIS FILE
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ME: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`
  },
  
  // Product endpoints
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/products`,
    GET_ONE: (id) => `${API_BASE_URL}/products/${id}`,
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/products/${id}`,
    REVIEWS: (id) => `${API_BASE_URL}/products/${id}/reviews`
  },
  
  // Cart endpoints
  CART: {
    GET: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
    UPDATE_ITEM: (itemId) => `${API_BASE_URL}/cart/item/${itemId}`,
    REMOVE_ITEM: (itemId) => `${API_BASE_URL}/cart/item/${itemId}`,
    CLEAR: `${API_BASE_URL}/cart`
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    GET_ALL: `${API_BASE_URL}/orders`,
    GET_ONE: (id) => `${API_BASE_URL}/orders/${id}`,
    CANCEL: (id) => `${API_BASE_URL}/orders/${id}/cancel`
  }
};

export default API_BASE_URL;
