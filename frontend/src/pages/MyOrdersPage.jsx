import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, ArrowRight, Ban, CheckCircle2 } from 'lucide-react';
import { ordersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/orders');
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        const res = await ordersApi.getMyOrders();
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [isAuthenticated, navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order?')) return;
    try {
      const res = await ordersApi.cancel(orderId, 'Cancelled by customer');
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
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const statusColors = {
    PLACED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    CONFIRMED: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    PREPARING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    READY: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    OUT_FOR_DELIVERY: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    DELIVERED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brandViolet border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
          Retrieving dining history...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brandViolet/10 flex items-center justify-center text-brandViolet mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">No Orders Yet</h2>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          You haven't placed any culinary orders yet. Indulge in our exquisite tasting menu today.
        </p>
        <Link to="/menu" className="inline-block px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md">
          Explore Menu
        </Link>
      </div>
    );
  }

  const renderedOrderCards = [];
  orders.forEach((order) => {
    const renderedItemPreviews = [];
    if (order.items) {
      order.items.forEach((item) => {
        renderedItemPreviews.push(
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'}
              alt={item.food_name}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
            <div className="text-xs">
              <span className="font-bold text-lightText dark:text-darkText block">{item.food_name}</span>
              <span className="text-lightTextSecondary dark:text-darkTextSecondary">
                Qty: {item.quantity} • ${Number(item.unit_price).toFixed(2)}
              </span>
            </div>
          </div>
        );
      });
    }

    const canCancel = ['PLACED', 'CONFIRMED'].includes(order.status);

    renderedOrderCards.push(
      <div
        key={order.id}
        className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 premium-card"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-lightTextSecondary dark:text-darkTextSecondary block">
              Order #{order.order_number}
            </span>
            <span className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
              Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[order.status] || statusColors.PLACED}`}>
              {order.status.replace(/_/g, ' ')}
            </span>
            <span className="font-bold text-base text-lightText dark:text-darkText">
              ${Number(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renderedItemPreviews}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary truncate max-w-sm">
            Deliver to: {order.delivery_address}
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {canCancel && (
              <button
                onClick={() => handleCancelOrder(order.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Cancel Order
              </button>
            )}
            <Link
              to={`/orders/track/${order.id}`}
              className="px-5 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95"
            >
              Track Order <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Account Portal</span>
        <h1 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
          My Culinary Orders
        </h1>
      </div>

      <div className="space-y-6">
        {renderedOrderCards}
      </div>
    </div>
  );
}
