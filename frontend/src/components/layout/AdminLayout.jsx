import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add actual admin logout logic (clear tokens, etc.)
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-200 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul className="flex-1 space-y-4">
          <li>
            <Link to="/admin/dashboard" className="block text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="block text-gray-700 hover:text-gray-900">
              Manage Users
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="block text-gray-700 hover:text-gray-900">
              Manage Products
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className="block text-gray-700 hover:text-gray-900">
              Manage Orders
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          aria-label="Logout"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
