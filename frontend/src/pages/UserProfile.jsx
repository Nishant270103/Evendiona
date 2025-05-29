// src/pages/UserProfile.jsx - USER PROFILE PAGE
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        }
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-light text-gray-900 mb-8">My Profile</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                  <input
                    type="text"
                    value={profileData.address.street}
                    onChange={(e) => setProfileData({
                      ...profileData, 
                      address: {...profileData.address, street: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        address: {...profileData.address, city: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={profileData.address.zipCode}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        address: {...profileData.address, zipCode: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
