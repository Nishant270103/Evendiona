// src/components/product/EnhancedProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, EyeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import QuickViewModal from './QuickViewModal';
import StarRating from './StarRating';

export default function EnhancedProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1, 'M'); // Default size
  };

  return (
    <>
      <div 
        className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`}>
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
            
            {/* Quick Action Buttons */}
            <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
              isHovered ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}>
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                {isWishlisted ? (
                  <HeartSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Sale Badge */}
            {product.salePrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
              </div>
            )}

            {/* Quick Add Button */}
            <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <button
                onClick={handleQuickAdd}
                className="w-full bg-[#8A6552] text-white py-2 rounded-lg hover:bg-[#7A5542] transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="h-4 w-4" />
                <span>Quick Add</span>
              </button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 mb-2 hover:text-[#8A6552] transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <StarRating rating={product.rating || 4.5} size="sm" />
            <span className="text-sm text-gray-500 ml-2">({product.numReviews || 0})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-[#8A6552]">₹{product.salePrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-[#8A6552]">₹{product.price}</span>
            )}
          </div>

          {/* Size Options Preview */}
          <div className="flex items-center space-x-1 mt-3">
            {['S', 'M', 'L', 'XL'].map(size => (
              <span 
                key={size}
                className="w-6 h-6 border border-gray-300 rounded text-xs flex items-center justify-center text-gray-600"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal 
          product={product} 
          onClose={() => setShowQuickView(false)} 
        />
      )}
    </>
  );
}
