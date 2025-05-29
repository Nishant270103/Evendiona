// src/components/ProductCard.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product.name);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Wishlist logic here
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div 
      onClick={handleProductClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-md transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0]?.url || '/placeholder.png'}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          {isWishlisted ? (
            <HeartSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.salePrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock && product.stock > 0 ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingCartIcon className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
