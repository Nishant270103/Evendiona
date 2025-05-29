// src/data/products.js - REMOVE STATIC DATA, USE API INSTEAD
// Delete this file and use API calls instead

// Create new file: src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll(filters);
        if (response.success) {
          setProducts(response.data.products);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
};
