import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/formatters';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X, 
  RefreshCw,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';

export const AdminOrders = () => {
  const { addToast } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch admin orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
    try {
      setUpdatingStatus(true);
      const updated = await apiFetch(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus
        })
      });

      addToast(`Order #${orderId.slice(-6).toUpperCase()} updated!`, 'success');
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      ord._id.toLowerCase().includes(searchLower) ||
      (ord.user?.name && ord.user.name.toLowerCase().includes(searchLower)) ||
      (ord.user?.email && ord.user.email.toLowerCase().includes(searchLower)) ||
      (ord.shippingAddress?.fullName && ord.shippingAddress.fullName.toLowerCase().includes(searchLower));

    const matchesStatus = statusFilter === 'all' || ord.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-500">Track, inspect details and update order fulfillment statuses</p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Orders List
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-600"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" /> Loading customer orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No orders match your filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Order ID */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-extrabold text-indigo-600 block">
                        #{ord._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">
                        {ord.shippingAddress?.fullName || ord.user?.name || 'Customer'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {ord.user?.email || 'N/A'}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatINR(ord.totalAmount)}
                    </td>

                    {/* Payment Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : ord.paymentStatus === 'Failed'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status Select */}
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value, ord.paymentStatus)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold border outline-none cursor-pointer ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Record</span>
                  <h3 className="text-xl font-black text-slate-900">
                    Order #{selectedOrder._id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Customer Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
                    <User className="w-4 h-4 text-indigo-600" /> Customer Information
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Name:</span>
                    <strong className="text-slate-800">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Email:</span>
                    <strong className="text-slate-800">{selectedOrder.user?.email || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phone:</span>
                    <strong className="text-slate-800">{selectedOrder.shippingAddress?.phone || 'N/A'}</strong>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Shipping Destination
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedOrder.shippingAddress?.address}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}<br />
                    {selectedOrder.shippingAddress?.country || 'India'}
                  </p>
                </div>

              </div>

              {/* Payment Details */}
              <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> Payment & Transaction Identifiers
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-extrabold text-indigo-700 ml-1">{selectedOrder.paymentStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Order Status:</span>
                    <span className="font-extrabold text-indigo-700 ml-1">{selectedOrder.orderStatus}</span>
                  </div>
                  {selectedOrder.razorpayOrderId && (
                    <div className="col-span-2">
                      <span className="text-slate-500">Razorpay Order ID:</span>
                      <span className="font-mono text-indigo-600 ml-1 font-bold">{selectedOrder.razorpayOrderId}</span>
                    </div>
                  )}
                  {selectedOrder.razorpayPaymentId && (
                    <div className="col-span-2">
                      <span className="text-slate-500">Razorpay Payment ID:</span>
                      <span className="font-mono text-indigo-600 ml-1 font-bold">{selectedOrder.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Items */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Ordered Products</h4>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.products?.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400">
                            Qty: {item.quantity} × {formatINR(item.price)}
                          </span>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">
                        {formatINR(item.quantity * item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Status Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-slate-400 text-xs block">Total Order Amount</span>
                  <span className="text-2xl font-black text-indigo-600">{formatINR(selectedOrder.totalAmount)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Update Status:</span>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value, selectedOrder.paymentStatus)}
                    disabled={updatingStatus}
                    className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl border border-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
