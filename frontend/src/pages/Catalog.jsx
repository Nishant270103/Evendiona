import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import Footer from "../components/layout/Footer";

export default function Catalog() {
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "newest",
  });

  const { products, loading, error } = useProducts(filters);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 py-12">
          {products
            .filter(product => product.price !== 587)
            .map(product => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group cursor-pointer"
              >
                <div className="relative bg-gray-50 rounded-2xl overflow-hidden mb-6 hover:shadow-lg transition-all duration-500">
                  <img
                    src={
                      product.name === "Highland Mountains Tee"
                        ? "/images/evendiona-tshirt1.png"
                        : (product.images?.[0] || "/images/evendiona-tshirt1.png")
                    }
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.salePrice && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                      SALE
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">
                    ₹{product.salePrice || product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{product.price}
                    </span>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
