import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(null);
  const navigate = useNavigate();

  // Fetch wishlist
  const fetchWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.data);
      } else {
        setError(data.message || "Failed to load wishlist");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch {
      alert("Failed to remove from wishlist");
    }
    setRemoving(null);
  };

  // Add to cart (dummy, replace with your cart logic)
  const handleAddToCart = (product) => {
    // Example: navigate to product page or call add-to-cart API
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : wishlist.length === 0 ? (
          <div className="text-center text-gray-500 py-24">
            <p className="mb-4">Your wishlist is empty.</p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              onClick={() => navigate("/shop")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center p-4"
              >
                <img
                  src={product.images?.[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg mr-6"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    {product.category}
                  </p>
                  <p className="text-gray-900 font-bold mb-2">
                    ₹{product.price}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                      disabled={removing === product._id}
                    >
                      {removing === product._id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
