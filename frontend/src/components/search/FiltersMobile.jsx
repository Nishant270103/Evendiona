// src/components/search/FiltersMobile.jsx
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function FiltersMobile({ isOpen, onClose }) {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute right-0 h-full w-80 bg-white shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="font-medium mb-4">Price Range</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, e.target.value])}
                className="w-full"
              />
              <span className="text-primary font-medium">
                ₹0 - ₹{priceRange[1]}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Sizes</h3>
            <div className="grid grid-cols-3 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  className="p-2 border rounded-lg hover:border-primary hover:text-primary transition"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
