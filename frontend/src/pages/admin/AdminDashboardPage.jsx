import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await adminApi.getDashboard();
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-brandViolet border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Aggregating executive ledger...</p>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  const statusDist = dashboardData?.statusDistribution || {};
  const popularDishes = dashboardData?.popularDishes || [];
  const recentOrders = dashboardData?.recentOrders || [];
  const timeline = dashboardData?.revenueTimeline || [];

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${Number(summary.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `Today: $${Number(summary.todayRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      gradient: 'grad-navy-violet'
    },
    {
      label: 'Total Orders',
      value: summary.totalOrders || 0,
      sub: `${summary.activeOrders || 0} active in kitchen`,
      icon: ShoppingBag,
      gradient: 'grad-violet-pink'
    },
    {
      label: 'Registered Patrons',
      value: summary.totalCustomers || 0,
      sub: 'Verified customer accounts',
      icon: Users,
      gradient: 'grad-blue-indigo'
    },
    {
      label: 'Menu Dishes',
      value: summary.totalDishes || 0,
      sub: 'Catalog offerings',
      icon: UtensilsCrossed,
      gradient: 'grad-green-blue'
    }
  ];

  const renderedStatCards = [];
  statCards.forEach((card, idx) => {
    const IconComponent = card.icon;
    renderedStatCards.push(
      <div
        key={idx}
        className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-3 premium-card"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">
            {card.label}
          </span>
          <div className={`w-10 h-10 rounded-2xl ${card.gradient} flex items-center justify-center text-white shadow-sm`}>
            <IconComponent className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-0.5">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-lightText dark:text-darkText">{card.value}</h3>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary font-medium">{card.sub}</p>
        </div>
      </div>
    );
  });

  const statusList = [
    { key: 'PLACED', label: 'Placed', color: 'bg-blue-500' },
    { key: 'CONFIRMED', label: 'Confirmed', color: 'bg-indigo-500' },
    { key: 'PREPARING', label: 'Preparing', color: 'bg-amber-500' },
    { key: 'READY', label: 'Ready', color: 'bg-violet-500' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'bg-orange-500' },
    { key: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-500' },
    { key: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500' }
  ];

  const totalStatusCount = Math.max(1, summary.totalOrders || 1);
  const renderedStatusBars = [];
  statusList.forEach((st) => {
    const count = statusDist[st.key] || 0;
    const pct = Math.round((count / totalStatusCount) * 100);
    renderedStatusBars.push(
      <div key={st.key} className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-lightText dark:text-darkText">{st.label}</span>
          <span className="text-lightTextSecondary dark:text-darkTextSecondary font-bold">{count} ({pct}%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
          <div className={`h-full rounded-full ${st.color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  });

  const renderedPopularRows = [];
  popularDishes.forEach((dish, idx) => {
    renderedPopularRows.push(
      <tr key={idx} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
        <td className="py-3 px-4 flex items-center gap-3">
          <img
            src={dish.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'}
            alt={dish.food_name}
            className="w-10 h-10 rounded-xl object-cover shrink-0"
          />
          <span className="font-bold text-xs text-lightText dark:text-darkText">{dish.food_name}</span>
        </td>
        <td className="py-3 px-4 text-xs font-semibold text-lightText dark:text-darkText text-center">{dish.total_sold} units</td>
        <td className="py-3 px-4 text-xs font-bold text-brandViolet text-right">${Number(dish.total_revenue).toFixed(2)}</td>
      </tr>
    );
  });

  const renderedRecentOrders = [];
  recentOrders.forEach((order) => {
    renderedRecentOrders.push(
      <div key={order.id} className="p-4 rounded-2xl bg-lightElevated dark:bg-darkSurface border border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-brandViolet">#{order.order_number}</span>
            <span className="font-semibold text-lightText dark:text-darkText">{order.customer_name || order.recipient_name}</span>
          </div>
          <span className="text-[11px] text-lightTextSecondary dark:text-darkTextSecondary">
            {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 1} dishes
          </span>
        </div>

        <div className="text-right flex items-center gap-3">
          <div>
            <span className="font-bold text-lightText dark:text-darkText block">${Number(order.total_amount).toFixed(2)}</span>
            <span className="text-[10px] uppercase font-bold text-brandViolet tracking-wider">{order.status}</span>
          </div>
          <Link
            to={`/orders/track/${order.id}`}
            className="p-1.5 rounded-lg bg-lightSurface dark:bg-darkCard hover:text-brandViolet transition-colors"
            title="Inspect"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  });

  let maxTimelineRev = 1;
  timeline.forEach((t) => {
    if (Number(t.revenue) > maxTimelineRev) maxTimelineRev = Number(t.revenue);
  });

  const renderedTimelineBars = [];
  timeline.forEach((t, idx) => {
    const heightPct = Math.max(10, Math.round((Number(t.revenue) / maxTimelineRev) * 100));
    renderedTimelineBars.push(
      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
        <div className="text-[10px] font-bold text-brandViolet opacity-0 group-hover:opacity-100 transition-opacity">
          ${Number(t.revenue).toFixed(0)}
        </div>
        <div
          className="w-full rounded-t-lg grad-navy-violet transition-all group-hover:opacity-80"
          style={{ height: `${heightPct}%` }}
        />
        <span className="text-[10px] text-lightTextSecondary dark:text-darkTextSecondary truncate max-w-[40px]">
          {t.formatted_date}
        </span>
      </div>
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Operational Overview</span>
          <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Executive Command Center</h2>
        </div>
        <Link
          to="/admin/orders"
          className="px-4 py-2 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-sm hover:opacity-95"
        >
          Manage All Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderedStatCards}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText">
                14-Day Sales Velocity (Real Database Aggregations)
              </h3>
              <span className="text-xs text-lightTextSecondary dark:text-darkTextSecondary font-bold">Daily Gross Revenue</span>
            </div>

            {timeline.length > 0 ? (
              <div className="h-48 flex items-end gap-2 pt-6 pb-2">
                {renderedTimelineBars}
              </div>
            ) : (
              <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary py-8 text-center">
                Insufficient order history for 14-day timeline.
              </p>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText">
                Top Performing Culinary Creations
              </h3>
              <Link to="/admin/foods" className="text-xs font-bold text-brandViolet hover:underline">
                View All Dishes
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase font-bold text-lightTextSecondary dark:text-darkTextSecondary">
                    <th className="py-2.5 px-4">Dish</th>
                    <th className="py-2.5 px-4 text-center">Units Sold</th>
                    <th className="py-2.5 px-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {renderedPopularRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText border-b border-black/5 dark:border-white/5 pb-3">
              Order Pipeline Distribution
            </h3>
            <div className="space-y-3">
              {renderedStatusBars}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
              <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText">Recent Orders</h3>
              <Link to="/admin/orders" className="text-xs font-bold text-brandViolet hover:underline">
                All
              </Link>
            </div>
            <div className="space-y-3">
              {renderedRecentOrders}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
