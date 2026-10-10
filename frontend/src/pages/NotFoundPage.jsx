import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl grad-violet-pink flex items-center justify-center text-white mx-auto shadow-glow-violet">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="font-serif text-6xl font-bold text-brandViolet block">404</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-lightText dark:text-darkText">
            Page Not Plated
          </h1>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            The culinary course or destination you are seeking cannot be located in our catalog.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
          >
            Return Home
          </Link>
          <Link
            to="/menu"
            className="px-6 py-2.5 rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-xs font-bold text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
