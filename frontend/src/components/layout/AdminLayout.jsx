import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul>
          <li className="mb-4"><Link to="/admin/dashboard">Dashboard</Link></li>
          <li className="mb-4"><Link to="/admin/users">Manage Users</Link></li>
          <li className="mb-4"><Link to="/admin/products">Manage Products</Link></li>
          <li className="mb-4"><Link to="/admin/orders">Manage Orders</Link></li>
        </ul>
        <button className="bg-red-500 text-white px-4 py-2 mt-4">
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}