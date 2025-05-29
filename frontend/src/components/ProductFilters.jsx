// src/components/ProductFilters.jsx

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductFilters({ onFiltersChange, className = "" }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
    sortOrder: 'desc'
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    priceRange: { minPrice: 0, maxPrice: 10000 }
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Debounced filter change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(filters);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  const fetchFilterOptions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products/filters');
      const data = await res.json();
      if (data.success) {
        setFilterOptions(data.data);
        // Set initial max price
        setFilters(prev => ({
          ...prev,
          maxPrice: data.data.priceRange.maxPrice
        }));
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: filterOptions.priceRange.maxPrice,
      sortBy: '',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = filters.search || 
                          filters.category || 
                          filters.minPrice || 
                          (filters.maxPrice && filters.maxPrice < filterOptions.priceRange.maxPrice) ||
                          filters.sortBy;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="p-4 border-b border-gray-200 md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          >
            <option value="">All Categories</option>
            {filterOptions.categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹{filterOptions.priceRange.minPrice}</span>
            <span>₹{filterOptions.priceRange.maxPrice?.toLocaleString()}</span>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          >
            <option value="">Default (Newest)</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        {/* Sort Order */}
        {filters.sortBy && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="asc"
                  checked={filters.sortOrder === 'asc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="mr-2"
                />
                {filters.sortBy === 'price' ? 'Low to High' : 'A to Z'}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="desc"
                  checked={filters.sortOrder === 'desc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="mr-2"
                />
                {filters.sortBy === 'price' ? 'High to Low' : 'Z to A'}
              </label>
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-800 py-2 px-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
