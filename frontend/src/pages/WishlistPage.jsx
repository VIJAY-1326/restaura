import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brandPink/10 flex items-center justify-center text-brandPink mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Sign In for Saved Dishes</h2>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          Sign in to view and synchronize your curated favorite culinary creations.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brandPink/10 flex items-center justify-center text-brandPink mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Your Wishlist is Empty</h2>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          Browse our seasonal menu and tap the heart icon on any dish to save it for later.
        </p>
        <Link to="/menu" className="inline-block px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md">
          Browse Menu
        </Link>
      </div>
    );
  }

  const renderedWishlistCards = [];
  wishlistItems.forEach((item) => {
    renderedWishlistCards.push(
      <div
        key={item.id}
        className="p-5 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 flex flex-col justify-between premium-card"
      >
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(item.id)}
              className="absolute top-3 right-3 p-2 rounded-full bg-brandPink text-white shadow-md hover:opacity-90"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brandViolet">
              {item.category_name}
            </span>
            <Link to={`/food/${item.slug}`} className="hover:text-brandViolet transition-colors block">
              <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText line-clamp-1">
                {item.name}
              </h3>
            </Link>
            <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary line-clamp-2 mt-1">
              {item.description}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between mt-4">
          <span className="font-bold text-lg text-lightText dark:text-darkText">
            ${Number(item.price).toFixed(2)}
          </span>

          <button
            onClick={async () => {
              await addToCart(item.id, 1);
            }}
            disabled={!item.is_available}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-sm hover:opacity-95"
          >
            <Plus className="w-3.5 h-3.5" /> Move to Bag
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandPink">Curated Favorites</span>
          <h1 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
            Your Culinary Wishlist ({wishlistItems.length})
          </h1>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brandViolet hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Exploring
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderedWishlistCards}
      </div>
    </div>
  );
}
