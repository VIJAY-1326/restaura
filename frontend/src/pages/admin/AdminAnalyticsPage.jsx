import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Layers, PieChart } from 'lucide-react';
import { adminApi } from '../../services/api';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await adminApi.getAnalytics();
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-brandViolet border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Computing revenue analytics...</p>
      </div>
    );
  }

  const metrics = analytics?.metrics || {};
  const salesByCategory = analytics?.salesByCategory || [];
  const dailySales = analytics?.dailySales || [];
  const statusSummary = analytics?.orderStatusSummary || [];

  let maxCategoryRevenue = 1;
  salesByCategory.forEach((cat) => {
    if (Number(cat.revenue) > maxCategoryRevenue) maxCategoryRevenue = Number(cat.revenue);
  });

  const renderedCategoryBars = [];
  salesByCategory.forEach((cat, idx) => {
    const pct = Math.max(8, Math.round((Number(cat.revenue) / maxCategoryRevenue) * 100));
    renderedCategoryBars.push(
      <div key={idx} className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-bold text-lightText dark:text-darkText">{cat.category_name}</span>
          <span className="text-brandViolet font-bold">${Number(cat.revenue).toFixed(2)} ({cat.items_sold} dishes)</span>
        </div>
        <div className="w-full h-3 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
          <div className="h-full rounded-full grad-navy-violet" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  });

  const renderedStatusSummaryRows = [];
  statusSummary.forEach((st, idx) => {
    renderedStatusSummaryRows.push(
      <tr key={idx} className="border-b border-black/5 dark:border-white/5">
        <td className="py-3 px-4 font-bold text-xs text-lightText dark:text-darkText">{st.status}</td>
        <td className="py-3 px-4 text-xs font-semibold text-center text-lightTextSecondary dark:text-darkTextSecondary">{st.count}</td>
        <td className="py-3 px-4 text-xs font-bold text-right text-brandViolet">${Number(st.total_value).toFixed(2)}</td>
      </tr>
    );
  });

  let maxDailyRev = 1;
  dailySales.forEach((d) => {
    if (Number(d.revenue) > maxDailyRev) maxDailyRev = Number(d.revenue);
  });

  const renderedDailyBars = [];
  dailySales.forEach((d, idx) => {
    const heightPct = Math.max(10, Math.round((Number(d.revenue) / maxDailyRev) * 100));
    renderedDailyBars.push(
      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
        <div className="text-[10px] font-bold text-brandViolet opacity-0 group-hover:opacity-100 transition-opacity">
          ${Number(d.revenue).toFixed(0)}
        </div>
        <div
          className="w-full rounded-t-lg grad-violet-pink transition-all group-hover:opacity-80"
          style={{ height: `${heightPct}%` }}
        />
        <span className="text-[10px] text-lightTextSecondary dark:text-darkTextSecondary truncate max-w-[45px]">
          {d.formatted_date?.split(',')[1]?.trim() || d.sale_date}
        </span>
      </div>
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Financial Intelligence</span>
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Analytics & Performance</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-1 premium-card">
          <span className="text-xs font-bold uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">
            Average Order Ticket
          </span>
          <h3 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
            ${Number(metrics.avgOrderValue || 0).toFixed(2)}
          </h3>
          <p className="text-[11px] text-lightTextSecondary dark:text-darkTextSecondary">Calculated across fulfilled orders</p>
        </div>

        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-1 premium-card">
          <span className="text-xs font-bold uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">
            Highest Order Ticket
          </span>
          <h3 className="font-serif text-3xl font-bold text-brandViolet">
            ${Number(metrics.maxOrderValue || 0).toFixed(2)}
          </h3>
          <p className="text-[11px] text-lightTextSecondary dark:text-darkTextSecondary">Single banquet checkout</p>
        </div>

        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-1 premium-card">
          <span className="text-xs font-bold uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">
            Active Catalog Categories
          </span>
          <h3 className="font-serif text-3xl font-bold text-brandPink">
            {salesByCategory.length}
          </h3>
          <p className="text-[11px] text-lightTextSecondary dark:text-darkTextSecondary">Revenue generating lines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
            <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText">
              Gross Revenue by Culinary Category
            </h3>
            <Layers className="w-4 h-4 text-brandViolet" />
          </div>

          <div className="space-y-4">
            {renderedCategoryBars.length > 0 ? (
              renderedCategoryBars
            ) : (
              <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary py-8 text-center">
                No categorical revenue recorded yet.
              </p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
            <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText">
              Order Stage Financial Breakdown
            </h3>
            <PieChart className="w-4 h-4 text-brandViolet" />
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase font-bold text-lightTextSecondary dark:text-darkTextSecondary">
                <th className="py-2.5 px-4">Stage</th>
                <th className="py-2.5 px-4 text-center">Count</th>
                <th className="py-2.5 px-4 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {renderedStatusSummaryRows}
            </tbody>
          </table>
        </div>
      </div>

      {dailySales.length > 0 && (
        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
            <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText">
              30-Day Daily Gross Trajectory
            </h3>
            <TrendingUp className="w-4 h-4 text-brandGreen" />
          </div>

          <div className="h-56 flex items-end gap-2 pt-6 pb-2">
            {renderedDailyBars}
          </div>
        </div>
      )}
    </div>
  );
}
