// src/pages/admin/AdminSettings.jsx
import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings(data.data || {});
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = e => setSettings({ ...settings, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    await fetch("http://localhost:5000/api/admin/settings", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settings)
    });
    alert("Settings saved!");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" name="name" value={settings.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Save Settings</button>
        </form>
      </div>
    </div>
  );
}
