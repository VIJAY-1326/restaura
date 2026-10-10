import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brandViolet/50 ${
        isDark
          ? 'bg-darkElevated text-amber-400 hover:bg-[#1f2b45] hover:text-amber-300'
          : 'bg-lightElevated text-slate-700 hover:bg-slate-200 hover:text-brandOrange'
      } ${className}`}
    >
      {isDark ? <Sun className="w-5 h-5 transition-transform duration-300 rotate-0" /> : <Moon className="w-5 h-5 transition-transform duration-300 rotate-0" />}
    </button>
  );
}
