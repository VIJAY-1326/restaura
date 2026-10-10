import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Package,
  Bike,
  Home,
  AlertTriangle,
  ArrowLeft,
  RotateCw,
  MapPin,
  Phone
} from 'lucide-react';
import { ordersApi } from '../services/api';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await ordersApi.getById(id);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brandViolet border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
          Connecting to kitchen beacon...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Order Not Found</h2>
        <Link to="/orders" className="inline-block px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Dispatched to kitchen brigade', icon: CheckCircle2 },
    { key: 'CONFIRMED', title: 'Confirmed', desc: 'Recipe ingredients assigned', icon: Clock },
    { key: 'PREPARING', title: 'Master Chef Preparing', desc: 'Handcrafted cooking & plating', icon: ChefHat },
    { key: 'READY', title: 'Packed & Insulated', desc: 'Secured in thermal containment', icon: Package },
    { key: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', desc: 'White-glove courier en route', icon: Bike },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Arrived at your destination', icon: Home }
  ];

  const statusIndexMap = {
    PLACED: 0,
    CONFIRMED: 1,
    PREPARING: 2,
    READY: 3,
    OUT_FOR_DELIVERY: 4,
    DELIVERED: 5,
    CANCELLED: -1
  };

  const currentIndex = statusIndexMap[order.status] ?? 0;
  const isCancelled = order.status === 'CANCELLED';

  const renderedSteps = [];
  steps.forEach((step, idx) => {
    const IconComponent = step.icon;
    const isCompleted = !isCancelled && idx <= currentIndex;
    const isCurrent = !isCancelled && idx === currentIndex;

    renderedSteps.push(
      <div key={step.key} className="flex items-start gap-4 relative pb-8 last:pb-0">
        {idx !== steps.length - 1 && (
          <div
            className={`absolute left-5 top-10 bottom-0 w-0.5 transition-colors ${
              idx < currentIndex ? 'bg-brandViolet' : 'bg-black/10 dark:bg-white/10'
            }`}
          />
        )}

        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${
            isCurrent
              ? 'grad-navy-violet text-white shadow-glow-violet scale-110'
              : isCompleted
              ? 'bg-brandViolet/20 text-brandViolet dark:bg-brandViolet/30'
              : 'bg-black/5 dark:bg-white/5 text-slate-400'
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="pt-1">
          <h4 className={`text-sm font-bold ${isCurrent ? 'text-brandViolet font-serif text-base' : 'text-lightText dark:text-darkText'}`}>
            {step.title}
          </h4>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary mt-0.5">
            {step.desc}
          </p>
        </div>
      </div>
    );
  });

  const renderedItems = [];
  if (order.items) {
    order.items.forEach((item) => {
      renderedItems.push(
        <div key={item.id} className="flex justify-between items-center text-xs py-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brandViolet">{item.quantity}x</span>
            <span className="text-lightText dark:text-darkText font-semibold">{item.food_name}</span>
          </div>
          <span className="font-bold text-lightText dark:text-darkText">${Number(item.total_price).toFixed(2)}</span>
        </div>
      );
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-lightTextSecondary dark:text-darkTextSecondary hover:text-brandViolet"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchOrder();
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brandViolet hover:underline self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Status
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet block">
            Live Order Beacon
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-lightText dark:text-darkText">
            Order #{order.order_number}
          </h1>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary mt-1">
            Payment: {order.payment_method} ({order.payment_status})
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-lightTextSecondary dark:text-darkTextSecondary block">Status</span>
          <span className="inline-block mt-1 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider grad-navy-violet text-white shadow-glow-violet">
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {isCancelled ? (
        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-red-500">This Order Has Been Cancelled</h3>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary max-w-md mx-auto">
            Reason: {order.cancel_reason || 'Cancelled by customer or management'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6">
            <h3 className="font-serif font-bold text-lg text-lightText dark:text-darkText border-b border-black/5 dark:border-white/5 pb-4">
              Live Progress Stages
            </h3>
            <div className="space-y-2">
              {renderedSteps}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4">
              <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText border-b border-black/5 dark:border-white/5 pb-3">
                Delivery Destination
              </h3>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-lightText dark:text-darkText">{order.recipient_name}</p>
                <p className="text-lightTextSecondary dark:text-darkTextSecondary flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brandViolet" /> {order.recipient_phone}
                </p>
                <p className="text-lightTextSecondary dark:text-darkTextSecondary flex items-start gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-brandViolet shrink-0 mt-0.5" /> {order.delivery_address}
                </p>
                {order.delivery_instructions && (
                  <p className="p-3 rounded-xl bg-lightElevated dark:bg-darkSurface text-lightTextSecondary dark:text-darkTextSecondary italic mt-2">
                    Note: "{order.delivery_instructions}"
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4">
              <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText border-b border-black/5 dark:border-white/5 pb-3">
                Items Summary
              </h3>
              <div className="space-y-1">
                {renderedItems}
              </div>
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex justify-between text-sm font-bold text-lightText dark:text-darkText">
                <span>Total Amount</span>
                <span className="text-brandViolet">${Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
