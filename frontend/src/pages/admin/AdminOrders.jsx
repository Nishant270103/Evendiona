// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data.data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b last:border-b-0">
                <td className="px-4 py-2">{order.orderNumber || order._id}</td>
                <td className="px-4 py-2">{order.customerName || order.user?.name}</td>
                <td className="px-4 py-2">₹{order.pricing?.total || order.amount}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="text-red-600 hover:underline">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
