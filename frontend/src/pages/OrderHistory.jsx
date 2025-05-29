// src/pages/OrderHistory.jsx - MODERN MINIMALIST ORDER HISTORY
import { useState } from "react";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [filter, setFilter] = useState('all');

  const orders = [
    {
      id: 'EVN-ABC123DEF',
      date: '2024-12-15',
      status: 'Delivered',
      total: 999,
      items: [
        { name: 'Highland Mountains Tee', size: 'L', color: 'Black', quantity: 1, price: 999 }
      ]
    },
    {
      id: 'EVN-XYZ789GHI',
      date: '2024-12-10',
      status: 'Shipped',
      total: 1998,
      items: [
        { name: 'Adventure Collection Tee', size: 'M', color: 'Navy', quantity: 2, price: 999 }
      ]
    },
    {
      id: 'EVN-LMN456OPQ',
      date: '2024-12-05',
      status: 'Processing',
      total: 999,
      items: [
        { name: 'Classic Cotton Tee', size: 'XL', color: 'White', quantity: 1, price: 999 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">
            Order History
          </h1>
          <p className="text-gray-600 font-light">View and track all your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex space-x-4">
            {['all', 'processing', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-8 shadow-sm">
              
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    Order {order.id}
                  </h2>
                  <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-xl font-medium">₹{order.total}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                      <img
                        src="/images/tshirt1.jpg"
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-2xl">👕</div>';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Size: {item.size} • Color: {item.color} • Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button className="bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg">
                  Track Order
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 font-medium hover:border-gray-400 transition-colors rounded-lg">
                  Reorder
                </button>
                {order.status === 'Delivered' && (
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 font-medium hover:border-gray-400 transition-colors rounded-lg">
                    Return/Exchange
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
            <Link
              to="/collection"
              className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
