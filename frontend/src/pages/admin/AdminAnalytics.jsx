// src/pages/admin/AdminAnalytics.jsx

import { useState, useEffect } from 'react';
import { ChartBarIcon, UsersIcon, ShoppingBagIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    revenueTrend: [],
    categorySales: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/admin/analytics?range=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch (err) {
        alert('Failed to load analytics');
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [timeRange]);

  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: stats.revenueTrend.length === 7 ? stats.revenueTrend : [0,0,0,0,0,0,0],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6
    }]
  };

  const categoryData = {
    labels: stats.categorySales.map(c => c.label),
    datasets: [{
      data: stats.categorySales.map(c => c.value),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
        ticks: { color: '#6B7280', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { size: 11 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    cutout: '60%'
  };

  if (loading) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your store's performance and trends.</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPI icon={<CurrencyRupeeIcon className="h-8 w-8 text-white" />} label="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString()}`} color="from-blue-500 to-blue-600" />
          <KPI icon={<ShoppingBagIcon className="h-8 w-8 text-white" />} label="Total Orders" value={stats.totalOrders} color="from-green-500 to-green-600" />
          <KPI icon={<UsersIcon className="h-8 w-8 text-white" />} label="Total Customers" value={stats.totalCustomers} color="from-purple-500 to-purple-600" />
          <KPI icon={<ChartBarIcon className="h-8 w-8 text-white" />} label="Conversion Rate" value={`${stats.conversionRate}%`} color="from-orange-500 to-orange-600" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Revenue Trends</h3>
              <p className="text-sm text-gray-600">Daily revenue for the selected period</p>
            </div>
            <div className="h-80">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>
          {/* Category Sales */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Sales by Category</h3>
              <p className="text-sm text-gray-600">Product category breakdown</p>
            </div>
            <div className="h-80">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, color }) {
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
