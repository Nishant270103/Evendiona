// src/pages/MyAccount.jsx
import { useEffect, useState } from "react";
import {
  getProfile, updateProfile, changePassword,
  addAddress, editAddress, deleteAddress
} from "../api/user";
import { useAuth } from "../context/AuthContext";

export default function MyAccount() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({});
  const [addressForm, setAddressForm] = useState({});
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    getProfile(token).then(setUser);
  }, [token]);

  // Edit profile handlers
  const handleProfileChange = e => setProfileForm({...profileForm, [e.target.name]: e.target.value});
  const handleProfileSave = async () => {
    const updated = await updateProfile(profileForm, token);
    setUser(updated);
    setEditMode(false);
  };

  // Password change handlers
  const handlePasswordChange = e => setPasswordForm({...passwordForm, [e.target.name]: e.target.value});
  const handlePasswordSave = async () => {
    await changePassword(passwordForm, token);
    setPasswordForm({});
    alert("Password changed!");
  };

  // Address book handlers
  const handleAddressChange = e => setAddressForm({...addressForm, [e.target.name]: e.target.value});
  const handleAddressSave = async () => {
    if (editingAddressId) {
      const updated = await editAddress(editingAddressId, addressForm, token);
      setUser({...user, addresses: updated});
      setEditingAddressId(null);
    } else {
      const updated = await addAddress(addressForm, token);
      setUser({...user, addresses: updated});
    }
    setAddressForm({});
  };
  const handleAddressEdit = address => {
    setAddressForm(address);
    setEditingAddressId(address._id);
  };
  const handleAddressDelete = async addressId => {
    const updated = await deleteAddress(addressId, token);
    setUser({...user, addresses: updated});
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      {/* Profile Info */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Profile</h2>
        {editMode ? (
          <div>
            <input name="name" value={profileForm.name || user.name} onChange={handleProfileChange} placeholder="Name" />
            <input name="email" value={profileForm.email || user.email} onChange={handleProfileChange} placeholder="Email" />
            <input name="phone" value={profileForm.phone || user.phone} onChange={handleProfileChange} placeholder="Phone" />
            <button onClick={handleProfileSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Phone: {user.phone}</div>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </section>

      {/* Password Change */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Change Password</h2>
        <input name="oldPassword" type="password" placeholder="Old Password" onChange={handlePasswordChange} />
        <input name="newPassword" type="password" placeholder="New Password" onChange={handlePasswordChange} />
        <button onClick={handlePasswordSave}>Change Password</button>
      </section>

      {/* Address Book */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Address Book</h2>
        <div>
          {user.addresses?.map(addr => (
            <div key={addr._id} className="border p-2 mb-2">
              <div>{addr.label}: {addr.addressLine1}, {addr.city}, {addr.state}</div>
              <button onClick={() => handleAddressEdit(addr)}>Edit</button>
              <button onClick={() => handleAddressDelete(addr._id)}>Delete</button>
            </div>
          ))}
        </div>
        <div>
          <input name="label" placeholder="Label (Home/Office)" value={addressForm.label || ""} onChange={handleAddressChange} />
          <input name="addressLine1" placeholder="Address Line 1" value={addressForm.addressLine1 || ""} onChange={handleAddressChange} />
          <input name="city" placeholder="City" value={addressForm.city || ""} onChange={handleAddressChange} />
          {/* Add more fields as needed */}
          <button onClick={handleAddressSave}>{editingAddressId ? "Update" : "Add"} Address</button>
        </div>
      </section>

      {/* Order History */}
      <section>
        <h2 className="font-semibold mb-2">Order History</h2>
        <ul>
          {user.orders?.map(order => (
            <li key={order._id}>
              Order #{order._id} - {order.status} - {order.total}₹
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
