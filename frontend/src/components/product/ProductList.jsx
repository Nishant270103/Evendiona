// src/components/product/ProductList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ProductList({ category, limit, title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const apiUrl =
          (process.env.REACT_APP_API_URL || "http://localhost:5000") +
          "/api/products";
        const params = {};
        if (category) params.category = category;
        if (limit) params.limit = limit;

        const res = await axios.get(apiUrl, { params });
        // Adjust to your backend response
        const apiProducts =
          res.data?.data?.products ||
          res.data?.products ||
          Array.isArray(res.data) ? res.data : [];

        if (isMounted) setProducts(apiProducts);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load products. Please try again later.");
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
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

  if (!products.length) {
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
