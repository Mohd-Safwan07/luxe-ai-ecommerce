import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { formatINR } from '../../utils/formatters';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, ordersData] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/orders')
      ]);

      setStats(statsData);
      setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
    } catch (err) {
      console.error('Failed to load admin dashboard stats:', err);
      setError(err.message || 'Failed to connect to backend admin services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading admin metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-rose-600" />
          <h3 className="font-extrabold text-lg">Unable to load Admin Data</h3>
        </div>
        <p className="text-xs text-rose-600">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rose-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatINR(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'from-indigo-500 to-blue-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Customers',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50'
    },
    {
      title: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-green-700',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold text-indigo-300 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Executive Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">E-Commerce Control Panel</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Live statistics, order tracking, product inventory metrics and revenue analytics.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Live Metrics
          </button>
        </div>
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* Grid of 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div className={`w-12 h-12 rounded-2xl ${card.bgColor} ${card.textColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500">Latest completed and pending orders</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            View All Orders <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-medium">
            No orders found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">Order ID</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Items</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Payment</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-slate-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-2 text-slate-700">
                      {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      {order.products?.length || 0} items
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-900">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
