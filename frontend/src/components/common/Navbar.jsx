import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu as MenuIcon, X, UtensilsCrossed, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, setIsDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navLinksData = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const renderedDesktopLinks = [];
  navLinksData.forEach((link) => {
    const isActive = location.pathname === link.path;
    renderedDesktopLinks.push(
      <Link
        key={link.path}
        to={link.path}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? 'text-brandViolet dark:text-brandViolet font-semibold'
            : 'text-lightTextSecondary dark:text-darkTextSecondary hover:text-lightText dark:hover:text-darkText'
        }`}
      >
        {link.label}
      </Link>
    );
  });

  const renderedMobileLinks = [];
  navLinksData.forEach((link) => {
    const isActive = location.pathname === link.path;
    renderedMobileLinks.push(
      <Link
        key={`mobile-${link.path}`}
        to={link.path}
        className={`px-4 py-2.5 text-base rounded-xl font-medium transition-colors ${
          isActive
            ? 'bg-brandViolet/10 text-brandViolet font-semibold'
            : 'text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-lightSurface/90 dark:bg-darkSurface/90 backdrop-blur-md shadow-md border-b border-black/5 dark:border-white/5'
          : 'bg-lightSurface dark:bg-darkSurface border-b border-black/5 dark:border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl grad-violet-pink flex items-center justify-center text-white shadow-glow-violet transition-transform group-hover:scale-105">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-brandViolet via-brandBlue to-brandPink bg-clip-text text-transparent">
                Restaura
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
                Fine Dining
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {renderedDesktopLinks}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-lightTextSecondary dark:text-darkTextSecondary hover:text-brandPink dark:hover:text-brandPink hover:bg-brandPink/10 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.size > 0 && (
                <span className="absolute -top-1 -right-1 bg-brandPink text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistIds.size}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-xl text-lightTextSecondary dark:text-darkTextSecondary hover:text-brandViolet dark:hover:text-brandViolet hover:bg-brandViolet/10 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brandViolet text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-glow-violet">
                  {cart.totalItemsCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 py-1 px-2 rounded-xl bg-lightElevated dark:bg-darkElevated hover:ring-2 hover:ring-brandViolet/30 transition-all text-sm font-medium"
                >
                  <div className="w-8 h-8 rounded-lg grad-navy-violet text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden lg:inline text-lightText dark:text-darkText max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-lightTextSecondary dark:text-darkTextSecondary" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-lightSurface dark:bg-darkSurface border border-black/10 dark:border-white/10 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-black/5 dark:border-white/5">
                      <p className="text-sm font-semibold text-lightText dark:text-darkText truncate">{user?.name}</p>
                      <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-brandViolet font-semibold hover:bg-brandViolet/10 transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </Link>

                    <Link
                      to="/addresses"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <UtensilsCrossed className="w-4 h-4" /> Delivery Addresses
                    </Link>

                    <div className="border-t border-black/5 dark:border-white/5 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-white rounded-xl grad-navy-violet shadow-sm hover:opacity-95 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 md:hidden rounded-xl text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 dark:border-white/5 bg-lightSurface dark:bg-darkSurface px-4 pt-3 pb-6 space-y-2">
          {renderedMobileLinks}
          {!isAuthenticated && (
            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
              <Link to="/login" className="w-full text-center py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold">
                Log In
              </Link>
              <Link to="/register" className="w-full text-center py-2.5 rounded-xl grad-navy-violet text-white text-sm font-semibold">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
