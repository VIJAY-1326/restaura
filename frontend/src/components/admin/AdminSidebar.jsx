import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Foods & Dishes', path: '/admin/foods', icon: UtensilsCrossed },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customer Base', path: '/admin/customers', icon: Users },
    { label: 'Restaurant Settings', path: '/admin/settings', icon: Settings },
    { label: 'Analytics & Sales', path: '/admin/analytics', icon: BarChart3 }
  ];

  const renderedNavItems = [];
  navItems.forEach((item) => {
    const IconComponent = item.icon;
    const isActive = location.pathname === item.path;
    renderedNavItems.push(
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? 'grad-navy-violet text-white shadow-glow-violet'
            : 'text-lightTextSecondary dark:text-darkTextSecondary hover:text-lightText dark:hover:text-darkText hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <IconComponent className="w-5 h-5 shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  });

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-lightSurface dark:bg-darkSurface border-r border-black/5 dark:border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 px-6 flex items-center justify-between border-b border-black/5 dark:border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grad-violet-pink flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-lightText dark:text-darkText">
                Restaura
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-bold text-brandViolet">
                Executive Portal
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {renderedNavItems}
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Switch to Guest Store
          </Link>
        </div>
      </aside>
    </>
  );
}
