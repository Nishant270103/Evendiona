// src/services/api.js - API SERVICE LAYER
import { API_ENDPOINTS } from '../config/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API call function
const apiCall = async (url, options = {}) => {
  try {
    const config = {
      headers: createHeaders(options.auth !== false),
      ...options,
    };

    console.log(`🔗 API Call: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    const data = await response.json();

    console.log(`✅ API Response:`, data);

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error(`❌ API Error:`, error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    return apiCall(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false
    });
  },

  login: async (credentials) => {
    return apiCall(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
      auth: false
    });
  },

  getMe: async () => {
    return apiCall(API_ENDPOINTS.AUTH.ME);
  },

  logout: async () => {
    return apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST'
    });
  }
};

// Product API calls
export const productAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.PRODUCTS.GET_ALL}?${queryString}` : API_ENDPOINTS.PRODUCTS.GET_ALL;
    return apiCall(url, { auth: false });
  },

  getOne: async (id) => {
    return apiCall(API_ENDPOINTS.PRODUCTS.GET_ONE(id), { auth: false });
  },

  create: async (productData) => {
    return apiCall(API_ENDPOINTS.PRODUCTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  update: async (id, productData) => {
    return apiCall(API_ENDPOINTS.PRODUCTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }
};

// Cart API calls
export const cartAPI = {
  get: async () => {
    return apiCall(API_ENDPOINTS.CART.GET);
  },

  add: async (itemData) => {
    return apiCall(API_ENDPOINTS.CART.ADD, {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  },

  updateItem: async (itemId, quantity) => {
    return apiCall(API_ENDPOINTS.CART.UPDATE_ITEM(itemId), {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  },

  removeItem: async (itemId) => {
    return apiCall(API_ENDPOINTS.CART.REMOVE_ITEM(itemId), {
      method: 'DELETE'
    });
  },

  clear: async () => {
    return apiCall(API_ENDPOINTS.CART.CLEAR, {
      method: 'DELETE'
    });
  }
};

// Order API calls
export const orderAPI = {
  create: async (orderData) => {
    return apiCall(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.ORDERS.GET_ALL}?${queryString}` : API_ENDPOINTS.ORDERS.GET_ALL;
    return apiCall(url);
  },

  getOne: async (id) => {
    return apiCall(API_ENDPOINTS.ORDERS.GET_ONE(id));
  },

  cancel: async (id) => {
    return apiCall(API_ENDPOINTS.ORDERS.CANCEL(id), {
      method: 'PUT'
    });
  }
};
