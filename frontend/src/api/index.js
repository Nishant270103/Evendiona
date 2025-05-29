// src/api/index.js - COMPLETE API FILE
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests if it exists
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
  
  const token = user.token || admin.token;
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ PUBLIC APIs
export const fetchProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);

// ✅ USER APIs
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);

// ✅ ORDER APIs
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getOrders = () => API.get('/orders');

// ✅ ADMIN APIs - ADD THESE MISSING EXPORTS
export const loginAdmin = (credentials) => API.post('/auth/admin/login', credentials);
export const registerAdmin = (userData) => API.post('/auth/admin/register', userData);

// ✅ ADMIN USER MANAGEMENT
export const fetchUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const updateUser = (id, userData) => API.put(`/admin/users/${id}`, userData);

// ✅ ADMIN PRODUCT MANAGEMENT
export const createProduct = (product) => API.post('/admin/products', product);
export const updateProduct = (id, product) => API.put(`/admin/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);

// ✅ ADMIN ORDER MANAGEMENT
export const updateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/admin/orders/${id}`);

// ✅ DEFAULT EXPORT
export default API;
