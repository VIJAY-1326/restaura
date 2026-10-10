import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminHeader({ onMenuToggle, title }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-lightSurface dark:bg-darkSurface border-b border-black/5 dark:border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-lightText dark:text-darkText">
            {title || 'Executive Portal'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />

        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-black/5 dark:border-white/5">
          <div className="w-9 h-9 rounded-xl grad-navy-violet text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-lightText dark:text-darkText leading-none">{user?.name}</p>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brandViolet">Operations Director</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-1"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
