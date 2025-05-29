// src/pages/Profile.jsx - MODERN MINIMALIST PROFILE
import { useState } from "react";
import { UserIcon, ShoppingBagIcon, HeartIcon, CogIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-10 w-10 text-gray-500" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-600 font-light">john@example.com</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Profile Information</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Order History</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((order) => (
                      <div key={order} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">Order #12345{order}</h3>
                            <p className="text-gray-600 text-sm mt-1">Placed on Dec 15, 2024</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Delivered
                          </span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="font-medium">Total: ₹999</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add other tab contents similarly */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
