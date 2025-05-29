// src/components/product/ProductSearch.jsx
import { useState } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

function ProductSearch({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    categories: [],
    sortBy: "newest"
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    handleFilterChange("categories", newCategories);
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-3">Filters</h3>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Price Range</h4>
            <div className="flex items-center gap-2">
              <span>₹{filters.priceRange[0]}</span>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                className="flex-1"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange("priceRange", [0, parseInt(e.target.value)])}
              />
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {["Graphic", "Basic", "Oversized", "Limited"].map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.categories.includes(category)
                      ? "bg-black text-white"
                      : "bg-white border"
                  }`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Sort By</h4>
            <select
              className="w-full p-2 border rounded"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductSearch;
