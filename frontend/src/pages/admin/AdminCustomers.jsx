// src/pages/admin/AdminCustomers.jsx
import { useEffect, useState } from "react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/customers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCustomers(data.data || []);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Orders</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust._id} className="border-b last:border-b-0">
                <td className="px-4 py-2">{cust.name}</td>
                <td className="px-4 py-2">{cust.email}</td>
                <td className="px-4 py-2">{cust.ordersCount || cust.orders?.length || 0}</td>
                <td className="px-4 py-2">{new Date(cust.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:underline">View</button>
                  <button className="text-red-600 hover:underline">Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
