import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, ShoppingBag, DollarSign } from 'lucide-react';
import { adminApi } from '../../services/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCustomers({ search: search || undefined });
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCustomers();
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminApi.toggleCustomerStatus(id);
      if (res.data.success) {
        const nextCustomers = [];
        customers.forEach((c) => {
          if (c.id === id) {
            nextCustomers.push({ ...c, status: res.data.status });
          } else {
            nextCustomers.push(c);
          }
        });
        setCustomers(nextCustomers);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle customer status');
    }
  };

  const renderedRows = [];
  customers.forEach((customer) => {
    renderedRows.push(
      <tr key={customer.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
        <td className="py-3.5 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grad-navy-violet text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {customer.name?.charAt(0) || 'P'}
          </div>
          <div>
            <span className="font-bold text-xs text-lightText dark:text-darkText block">{customer.name}</span>
            <span className="text-[10px] text-lightTextSecondary dark:text-darkTextSecondary">{customer.email}</span>
          </div>
        </td>
        <td className="py-3.5 px-4 text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          {customer.phone || '—'}
        </td>
        <td className="py-3.5 px-4 text-xs font-bold text-lightText dark:text-darkText text-center">
          {customer.total_orders || 0}
        </td>
        <td className="py-3.5 px-4 text-xs font-bold text-brandViolet text-right">
          ${Number(customer.total_spent || 0).toFixed(2)}
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {customer.status}
          </span>
        </td>
        <td className="py-3.5 px-4 text-right">
          <button
            onClick={() => handleToggleStatus(customer.id)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              customer.status === 'active'
                ? 'text-slate-400 hover:text-red-500 hover:bg-red-500/10'
                : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10'
            }`}
            title={customer.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
          >
            {customer.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Patron Registry</span>
          <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Customer Accounts</h2>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5">
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase font-bold text-lightTextSecondary dark:text-darkTextSecondary">
              <th className="py-3 px-4">Patron</th>
              <th className="py-3 px-4">Telephone</th>
              <th className="py-3 px-4 text-center">Orders</th>
              <th className="py-3 px-4 text-right">Lifetime Spend</th>
              <th className="py-3 px-4 text-center">Account Status</th>
              <th className="py-3 px-4 text-right">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {renderedRows}
          </tbody>
        </table>

        {customers.length === 0 && !loading && (
          <p className="py-12 text-center text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            No patrons found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
