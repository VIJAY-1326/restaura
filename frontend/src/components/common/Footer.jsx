import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function Footer() {
  const quickLinksData = [
    { label: 'A La Carte Menu', path: '/menu' },
    { label: 'Chef Experience', path: '/about' },
    { label: 'Private Dining & Contact', path: '/contact' },
    { label: 'My Orders', path: '/orders' }
  ];

  const renderedQuickLinks = [];
  quickLinksData.forEach((item) => {
    renderedQuickLinks.push(
      <li key={item.path}>
        <Link to={item.path} className="text-lightTextSecondary dark:text-darkTextSecondary hover:text-brandViolet dark:hover:text-brandViolet transition-colors text-sm">
          {item.label}
        </Link>
      </li>
    );
  });

  return (
    <footer className="bg-lightElevated dark:bg-darkSurface border-t border-black/5 dark:border-white/5 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grad-violet-pink flex items-center justify-center text-white shadow-glow-violet">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-brandViolet via-brandBlue to-brandPink bg-clip-text text-transparent">
                  Restaura
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
                  Fine Dining & Lounge
                </span>
              </div>
            </Link>
            <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
              Curating elevated culinary artistry, sustainably sourced sea produce, dry-aged cuts, and botanical elixirs in an intimate ambiance.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-base text-lightText dark:text-darkText mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5">
              {renderedQuickLinks}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-base text-lightText dark:text-darkText mb-4">Concierge & Location</h4>
            <div className="space-y-3 text-sm text-lightTextSecondary dark:text-darkTextSecondary">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brandViolet shrink-0 mt-0.5" />
                <span>450 Epicurean Way, Gourmet District, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brandViolet shrink-0" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brandViolet shrink-0" />
                <span>concierge@restaura.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brandViolet shrink-0" />
                <span>Mon-Sun: 11:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-base text-lightText dark:text-darkText mb-4">The Restaura Club</h4>
            <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-4">
              Receive private invitations to seasonal tasting menus, wine pairing evenings, and chef masterclasses.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Restaura Club!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-lightSurface dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl grad-violet-pink text-white hover:opacity-90 transition-opacity"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-lightTextSecondary dark:text-darkTextSecondary gap-4">
          <p>© {new Date().getFullYear()} Restaura Fine Dining Group. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-lightText dark:hover:text-darkText cursor-pointer">Privacy Policy</span>
            <span className="hover:text-lightText dark:hover:text-darkText cursor-pointer">Terms of Service</span>
            <span className="hover:text-lightText dark:hover:text-darkText cursor-pointer">Food Safety Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
