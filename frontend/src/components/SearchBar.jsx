// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../api';

export default function SearchBar({ className = "" }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    try {
      setLoading(true);
      const { data } = await searchProducts(searchQuery);
      setSuggestions(data.slice(0, 6)); // Show top 6 results
      setIsOpen(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search for t-shirts, styles, colors..."
            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8A6552] focus:border-transparent bg-white"
          />
          
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-[#8A6552] border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">₹{product.price}</p>
                  </div>
                </div>
              ))}
              
              {query && (
                <div
                  onClick={handleSearch}
                  className="p-3 text-center text-[#8A6552] hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                >
                  Search for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
