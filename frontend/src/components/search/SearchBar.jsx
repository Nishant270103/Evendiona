// src/components/search/SearchBar.jsx
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { products } from "../../data/products";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center bg-white rounded-full border-2 border-gray-200 focus-within:border-primary">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full px-6 py-3 rounded-full focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <button
            onClick={() => setQuery("")}
            className="p-2 text-gray-500 hover:text-primary"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        ) : (
          <MagnifyingGlassIcon className="w-5 h-5 mr-4 text-gray-400" />
        )}
      </div>
      
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl z-50">
          {results.map(product => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center p-4 hover:bg-gray-50 border-b last:border-0"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="ml-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-primary">₹{product.price}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
