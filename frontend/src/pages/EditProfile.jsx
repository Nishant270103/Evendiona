// src/pages/EditProfile.jsx
import { useState, useEffect } from "react";

// Replace with your real API endpoint
const API_URL = "/api/user/profile";

export default function EditProfile({ initialProfile }) {
  // Optionally receive initial profile as prop, else use default
  const [profile, setProfile] = useState(
    initialProfile || {
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zip: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // If you fetch the profile from API, do it here
  useEffect(() => {
    if (!initialProfile) {
      // Example: fetch profile from API
      fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // Uncomment if using JWT
        },
      })
        .then((res) => res.json())
        .then((data) => setProfile(data))
        .catch(() => setError("Failed to load profile."));
    }
  }, [initialProfile]);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}` // Uncomment if using JWT
        },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        setSuccess("Profile updated successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update profile.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8"
    >
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Name</label>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      {/* Phone */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Phone</label>
        <input
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      {/* Street */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Street</label>
        <input
          name="street"
          value={profile.street}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {/* City */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">City</label>
        <input
          name="city"
          value={profile.city}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {/* ZIP */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">ZIP</label>
        <input
          name="zip"
          value={profile.zip}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {/* Save Button */}
      <button
        type="submit"
        className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
      {/* Feedback */}
      {success && <div className="text-green-600 mt-4">{success}</div>}
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </form>
  );
}
