import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust this import path based on your setup

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  if (!user?.isAdmin) {
    navigate('/'); // Redirect to homepage or login
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#8A6552] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Link to sub-sections */}
        <div className="p-6 border rounded shadow hover:bg-[#F9F7F5] transition">
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600 mb-4">View, update, or delete users.</p>
          <button 
            onClick={() => navigate('/admin/users')} 
            className="bg-[#8A6552] text-white px-4 py-2 rounded hover:bg-[#7A5542]"
          >
            Manage Users
          </button>
        </div>
        
        <div className="p-6 border rounded shadow hover:bg-[#F9F7F5] transition">
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600 mb-4">Add, update, or delete products.</p>
          <button 
            onClick={() => navigate('/admin/products')} 
            className="bg-[#8A6552] text-white px-4 py-2 rounded hover:bg-[#7A5542]"
          >
            Manage Products
          </button>
        </div>
        
        <div className="p-6 border rounded shadow hover:bg-[#F9F7F5] transition">
          <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
          <p className="text-gray-600 mb-4">Track and update orders.</p>
          <button 
            onClick={() => navigate('/admin/orders')} 
            className="bg-[#8A6552] text-white px-4 py-2 rounded hover:bg-[#7A5542]"
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
}