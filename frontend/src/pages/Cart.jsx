// src/pages/Cart.jsx - MODERN MINIMALIST CART
import { Link } from "react-router-dom";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // Add safety check for undefined cart
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 font-light">Start shopping to add items to your cart</p>
          <Link
            to="/collection"
            className="bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-4xl font-light text-gray-900 mb-12 tracking-wide">
          Shopping Cart
        </h1>

        <div className="space-y-8">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-6 bg-gray-50 p-6 rounded-2xl">
              
              {/* Product Image */}
              <div className="w-24 h-24 bg-white rounded-lg overflow-hidden">
                <img
                  src={item.image || "/images/tshirt1.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-2xl">👕</div>';
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm">
                  Size: {item.size} • Color: {item.color}
                </p>
                <p className="font-semibold text-gray-900 mt-2">
                  ₹{item.salePrice || item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.color, Math.max(1, item.quantity - 1))}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id, item.size, item.color)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-12 bg-gray-50 p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-light text-gray-900">Total</span>
            <span className="text-3xl font-medium text-gray-900">₹{getCartTotal()}</span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/collection"
              className="flex-1 border border-gray-300 text-gray-700 py-4 font-medium hover:border-gray-400 transition-colors text-center rounded-lg"
            >
              Continue Shopping
            </Link>
            <Link
              to="/checkout"
              className="flex-1 bg-gray-900 text-white py-4 font-medium hover:bg-gray-800 transition-colors text-center rounded-lg"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}