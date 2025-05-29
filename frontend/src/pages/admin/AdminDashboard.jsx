// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { ChartBarIcon, UsersIcon, ShoppingBagIcon, CurrencyRupeeIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    revenueTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const revenueChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: stats.revenueTrend.length === 7 ? stats.revenueTrend : [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<CurrencyRupeeIcon className="h-8 w-8 text-white" />} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="from-blue-500 to-blue-600" />
        <StatCard icon={<ShoppingBagIcon className="h-8 w-8 text-white" />} label="Total Orders" value={stats.totalOrders} color="from-green-500 to-green-600" />
        <StatCard icon={<UsersIcon className="h-8 w-8 text-white" />} label="Total Customers" value={stats.totalCustomers} color="from-purple-500 to-purple-600" />
        <StatCard icon={<ChartBarIcon className="h-8 w-8 text-white" />} label="Conversion Rate" value={`${stats.conversionRate}%`} color="from-orange-500 to-orange-600" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
        <div className="h-80">
          <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center">
      <div className={`bg-gradient-to-br ${color} p-4 rounded-xl mr-4`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
