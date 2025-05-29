// src/pages/OrderConfirmation.jsx - MODERN MINIMALIST ORDER CONFIRMATION
import { Link, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order || null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-light text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 font-light">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details */}
        {order ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Order Details</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium text-gray-900">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium text-gray-900">₹{order.pricing?.total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900 capitalize">{order.paymentInfo?.method}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-medium text-gray-900">3-5 Business Days</span>
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || '/images/tshirt1.jpg'}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Size: {item.size} • Color: {item.color}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <p className="text-gray-600 font-light">No order details available.</p>
            <p className="text-sm text-gray-500 mt-2">Your order has been placed successfully!</p>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">What's Next?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-medium text-gray-900 mb-2">Order Confirmation</h3>
              <p className="text-sm text-gray-600">You'll receive an email confirmation shortly</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-medium text-gray-900 mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">We'll prepare your order for shipping</p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-medium text-gray-900 mb-2">Tracking Info</h3>
              <p className="text-sm text-gray-600">You'll get tracking details once shipped</p>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your order, feel free to contact us.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="mailto:support@evendiona.com" className="text-blue-600 hover:text-blue-700">
              📧 support@evendiona.com
            </a>
            <span className="text-gray-400">|</span>
            <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-700">
              📞 +91 98765 43210
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg"
          >
            Track Your Order
          </Link>
          <Link
            to="/collection"
            className="border border-gray-300 text-gray-700 px-8 py-3 font-medium hover:border-gray-400 transition-colors rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Social Sharing */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Share your purchase with friends!</p>
          <div className="flex justify-center space-x-4">
            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              📘 Facebook
            </button>
            <button className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
              📷 Instagram
            </button>
            <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
