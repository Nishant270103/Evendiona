// src/hooks/useOrders.js - ORDER MANAGEMENT HOOK
import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

export const useOrders = (filters = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await orderAPI.getAll(filters);
        
        if (response.success) {
          setOrders(response.data.orders);
        } else {
          throw new Error(response.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [JSON.stringify(filters)]);

  return { orders, loading, error };
};

// Hook for creating orders
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderAPI.create(orderData);
      
      if (response.success) {
        return { success: true, order: response.data.order };
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};
