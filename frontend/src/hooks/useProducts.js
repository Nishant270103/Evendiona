// src/hooks/useProducts.js - CREATE THIS FILE
import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔗 Fetching products with filters:', filters);
        
        const response = await productAPI.getAll(filters);
        
        if (response.success) {
          setProducts(response.data.products);
          setPagination(response.data.pagination);
          console.log('✅ Products loaded:', response.data.products.length);
        } else {
          throw new Error(response.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error, pagination };
};

// Hook for single product
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔗 Fetching product:', productId);
        
        const response = await productAPI.getOne(productId);
        
        if (response.success) {
          setProduct(response.data.product);
          console.log('✅ Product loaded:', response.data.product.name);
        } else {
          throw new Error(response.message || 'Product not found');
        }
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

// Hook for featured products
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // You'll need to add this method to your productAPI
        const response = await fetch('http://localhost:5000/api/products/featured/list');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data.products);
          console.log('✅ Featured products loaded:', data.data.products.length);
        } else {
          throw new Error(data.message || 'Failed to fetch featured products');
        }
      } catch (err) {
        console.error('❌ Error fetching featured products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error };
};
