// src/components/cart/CartDrawer.jsx
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

function CartDrawer({ isOpen, onClose }) {
  // ✅ FIXED: Use correct destructuring names from CartContext
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                <button 
                  className="ml-3 h-7 w-7 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="mt-8">
                {cartItems.length === 0 ? (
                  // ✅ ADDED: Empty cart state
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button
                      onClick={onClose}
                      className="text-indigo-600 font-medium hover:text-indigo-500"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={`${item.id}-${item.selectedSize}`} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border rounded-md overflow-hidden">
                            <img
                              // ✅ FIXED: Handle both image formats with fallback
                              src={item.images?.[0] || item.image || '/images/placeholder.jpg'}
                              alt={item.name}
                              className="w-full h-full object-center object-cover"
                              onError={(e) => {
                                e.target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                {/* ✅ FIXED: Use salePrice if available, fallback to price */}
                                <p className="ml-4">₹{item.salePrice || item.price}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">Size: {item.selectedSize}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <button 
                                  className="px-2 border rounded-l hover:bg-gray-50 disabled:opacity-50"
                                  onClick={() => updateQuantity(item.id, item.selectedSize, Math.max(1, item.quantity - 1))}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 border-t border-b min-w-[50px] text-center">
                                  {item.quantity}
                                </span>
                                <button 
                                  className="px-2 border rounded-r hover:bg-gray-50"
                                  onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex">
                                <button 
                                  type="button" 
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                  // ✅ FIXED: Include selectedSize parameter
                                  onClick={() => removeFromCart(item.id, item.selectedSize)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  {/* ✅ FIXED: Use getCartTotal() function */}
                  <p>₹{getCartTotal().toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  {/* ✅ FIXED: Use Link instead of dummy anchor */}
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-medium hover:text-indigo-500"
                      onClick={onClose}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
