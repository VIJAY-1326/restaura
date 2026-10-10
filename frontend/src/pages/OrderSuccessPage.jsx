import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import { ordersApi } from '../services/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await ordersApi.getById(id);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brandViolet border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
          Finalizing order transmission...
        </p>
      </div>
    );
  }

  const renderedItems = [];
  if (order?.items) {
    order.items.forEach((item) => {
      renderedItems.push(
        <div key={item.id} className="flex justify-between items-center text-xs py-2 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brandViolet">{item.quantity}x</span>
            <span className="font-semibold text-lightText dark:text-darkText">{item.food_name}</span>
          </div>
          <span className="font-bold text-lightText dark:text-darkText">${Number(item.total_price).toFixed(2)}</span>
        </div>
      );
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 rounded-full grad-navy-violet flex items-center justify-center text-white mx-auto shadow-glow-violet">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
          Order Confirmed & Placed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-lightText dark:text-darkText">
          Thank You for Dining with Restaura
        </h1>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          Your order #{order?.order_number || id} has been received by our kitchen brigade and will be prepared shortly.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 text-left space-y-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary block">Order Reference</span>
            <span className="font-serif font-bold text-base text-brandViolet">{order?.order_number}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary block">Total Paid</span>
            <span className="font-bold text-base text-lightText dark:text-darkText">${Number(order?.total_amount || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">Courses Placed</h4>
          {renderedItems}
        </div>

        <div className="space-y-3 pt-2 text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brandViolet shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-lightText dark:text-darkText block">Recipient & Destination</span>
              <span>{order?.recipient_name} ({order?.recipient_phone})</span>
              <p className="text-lightTextSecondary dark:text-darkTextSecondary mt-0.5">{order?.delivery_address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brandViolet shrink-0" />
            <span>Estimated Kitchen & Courier Time: 35–45 minutes</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={`/orders/track/${order?.id || id}`}
          className="px-8 py-3.5 rounded-2xl grad-navy-violet text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-violet hover:opacity-95"
        >
          Track Live Progress <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/orders"
          className="px-8 py-3.5 rounded-2xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-xs font-bold text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
