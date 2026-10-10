import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { adminApi } from '../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders({
        status: selectedStatus,
        search: search || undefined
      });
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.data.success) {
        const nextOrders = [];
        orders.forEach((o) => {
          if (o.id === orderId) {
            nextOrders.push(res.data.data);
          } else {
            nextOrders.push(o);
          }
        });
        setOrders(nextOrders);
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(res.data.data);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const statusOptions = ['ALL', 'PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  const renderedStatusTabs = [];
  statusOptions.forEach((st) => {
    const isSelected = selectedStatus === st;
    renderedStatusTabs.push(
      <button
        key={st}
        onClick={() => setSelectedStatus(st)}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
          isSelected
            ? 'grad-navy-violet text-white shadow-glow-violet'
            : 'bg-lightElevated dark:bg-darkCard text-lightTextSecondary dark:text-darkTextSecondary hover:text-lightText dark:hover:text-darkText'
        }`}
      >
        {st.replace(/_/g, ' ')}
      </button>
    );
  });

  const statusBadgeColors = {
    PLACED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    CONFIRMED: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    PREPARING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    READY: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    OUT_FOR_DELIVERY: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    DELIVERED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  const renderedRows = [];
  orders.forEach((order) => {
    renderedRows.push(
      <tr key={order.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
        <td className="py-3.5 px-4">
          <span className="font-bold text-xs text-brandViolet block">#{order.order_number}</span>
          <span className="text-[10px] text-lightTextSecondary dark:text-darkTextSecondary">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </td>
        <td className="py-3.5 px-4">
          <span className="font-bold text-xs text-lightText dark:text-darkText block">{order.recipient_name}</span>
          <span className="text-[10px] text-lightTextSecondary dark:text-darkTextSecondary">{order.recipient_phone}</span>
        </td>
        <td className="py-3.5 px-4 text-xs font-semibold text-lightTextSecondary dark:text-darkTextSecondary max-w-xs truncate">
          {order.items?.length || 1} course items
        </td>
        <td className="py-3.5 px-4 text-xs font-bold text-lightText dark:text-darkText">
          ${Number(order.total_amount).toFixed(2)}
        </td>
        <td className="py-3.5 px-4">
          <select
            value={order.status}
            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
            disabled={['DELIVERED', 'CANCELLED'].includes(order.status)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border focus:outline-none ${
              statusBadgeColors[order.status] || statusBadgeColors.PLACED
            }`}
          >
            <option value="PLACED">PLACED</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PREPARING">PREPARING</option>
            <option value="READY">READY</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </td>
        <td className="py-3.5 px-4 text-right">
          <button
            onClick={() => setActiveOrder(order)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brandViolet hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Inspect Order Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  });

  const renderedActiveItems = [];
  if (activeOrder?.items) {
    activeOrder.items.forEach((item) => {
      renderedActiveItems.push(
        <div key={item.id} className="flex justify-between items-center text-xs py-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'}
              alt={item.food_name}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <span className="font-bold text-lightText dark:text-darkText block">{item.food_name}</span>
              <span className="text-[10px] text-lightTextSecondary dark:text-darkTextSecondary">
                {item.quantity} x ${Number(item.unit_price).toFixed(2)}
              </span>
            </div>
          </div>
          <span className="font-bold text-lightText dark:text-darkText">${Number(item.total_price).toFixed(2)}</span>
        </div>
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Fulfillment Operations</span>
          <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Orders & Table Delivery</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, patron..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {renderedStatusTabs}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase font-bold text-lightTextSecondary dark:text-darkTextSecondary">
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Patron</th>
              <th className="py-3 px-4">Dishes</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status Transition</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody>
            {renderedRows}
          </tbody>
        </table>

        {orders.length === 0 && !loading && (
          <p className="py-12 text-center text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            No orders found under this status.
          </p>
        )}
      </div>

      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-lightSurface dark:bg-darkSurface border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-brandViolet block">Manifest Details</span>
                <h3 className="font-serif font-bold text-xl text-lightText dark:text-darkText">
                  Order #{activeOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="text-slate-400 hover:text-lightText dark:hover:text-darkText text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-lightTextSecondary dark:text-darkTextSecondary">
              <div>
                <span className="font-bold text-lightText dark:text-darkText block">Recipient & Contact</span>
                <p>{activeOrder.recipient_name} ({activeOrder.recipient_phone})</p>
                <p>{activeOrder.delivery_address}</p>
                {activeOrder.delivery_instructions && (
                  <p className="italic mt-1 text-brandViolet">Note: "{activeOrder.delivery_instructions}"</p>
                )}
              </div>

              <div>
                <span className="font-bold text-lightText dark:text-darkText block">Payment Record</span>
                <p>{activeOrder.payment_method} — {activeOrder.payment_status} {activeOrder.transaction_id ? `(${activeOrder.transaction_id})` : ''}</p>
              </div>

              <div className="pt-2">
                <span className="font-bold text-lightText dark:text-darkText block mb-1">Courses</span>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {renderedActiveItems}
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex justify-between text-sm font-bold text-lightText dark:text-darkText">
                <span>Total Amount</span>
                <span className="text-brandViolet">${Number(activeOrder.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveOrder(null)}
                className="px-6 py-2 rounded-xl grad-navy-violet text-white text-xs font-bold"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
