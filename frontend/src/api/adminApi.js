import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests if it exists
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('adminUser'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// Admin Authentication APIs
export const registerAdmin = (formData) => API.post('/auth/admin/register', formData);
export const loginAdmin = (formData) => API.post('/auth/admin/login', formData);

// Admin Management APIs
export const fetchUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const fetchProducts = () => API.get('/products');
export const createProduct = (product) => API.post('/products', product);
export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, status);