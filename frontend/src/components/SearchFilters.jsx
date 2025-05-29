// src/components/search/SearchFilter.jsx
import { useState } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SearchFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 3000],
    categories: [],
    sortBy: "newest"
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const toggleCategory = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    handleFilterChange("categories", newCategories);
  };

  return (
    <div className="mb-12">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-12 py-3 border-b border-[#D4C8BE] bg-transparent focus:outline-none focus:border-[#8A6552] transition-colors"
        />
        <MagnifyingGlassIcon className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-[#8A6552]" />
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8A6552] hover:text-[#E7B7A3] transition-colors"
        >
          {showFilters ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#F9F7F5] p-6 rounded-md transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Price Range */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4 text-[#8A6552]">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-[#4A4A4A]">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange("priceRange", [0, parseInt(e.target.value)])}
                  className="w-full accent-[#8A6552]"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4 text-[#8A6552]">Categories</h3>
              <div className="space-y-2">
                {["Graphic Tees", "Oversized", "Basic", "Limited Edition"].map(category => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                      filters.categories.includes(category) 
                        ? "border-[#8A6552] bg-[#8A6552]" 
                        : "border-[#D4C8BE]"
                    }`}>
                      {filters.categories.includes(category) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span 
                      className="text-[#4A4A4A]"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4 text-[#8A6552]">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full p-2 border border-[#D4C8BE] bg-white focus:outline-none focus:border-[#8A6552]"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={() => setFilters({
                priceRange: [0, 3000],
                categories: [],
                sortBy: "newest"
              })}
              className="px-4 py-2 text-[#8A6552] hover:underline"
            >
              Reset Filters
            </button>
            <button 
              onClick={() => setShowFilters(false)}
              className="ml-4 px-6 py-2 bg-[#8A6552] text-white rounded-sm hover:bg-[#7A5542] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
