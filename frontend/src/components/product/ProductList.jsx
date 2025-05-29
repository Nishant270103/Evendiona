// src/components/product/ProductList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

// Mock data for development (will be used if API call fails)
const mockProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 599,
    image: "/images/tshirt1.jpg",
    category: "tshirts"
  },
  {
    id: 2,
    name: "Black Graphic T-Shirt",
    price: 699,
    image: "/images/tshirt2.jpg",
    category: "tshirts"
  },
  {
    id: 3,
    name: "Navy Blue T-Shirt",
    price: 649,
    image: "/images/tshirt1.jpg",
    category: "tshirts"
  },
  {
    id: 4,
    name: "Printed Designer T-Shirt",
    price: 799,
    image: "/images/tshirt2.jpg",
    category: "tshirts"
  }
];

export default function ProductList({ category, limit, title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from backend API first
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { category }
        });
        
        // If successful, use the API data
        const data = response.data;
        const limitedProducts = limit ? data.slice(0, limit) : data;
        setProducts(limitedProducts);
        setUsingMockData(false);
        
      } catch (err) {
        console.warn('API call failed, using mock data instead:', err.message);
        
        // If API call fails, fall back to mock data
        let filteredProducts = mockProducts;
        if (category) {
          filteredProducts = mockProducts.filter(p => p.category === category);
        }
        
        const limitedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;
        setProducts(limitedProducts);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#8A6552] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8">No products found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-normal mb-1 text-[#8A6552]">{title}</h2>
          <div className="h-px w-16 bg-[#E7B7A3]"></div>
        </div>
      )}
      
      {usingMockData && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
          Note: Using mock data. Connect your backend to see real products.
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
