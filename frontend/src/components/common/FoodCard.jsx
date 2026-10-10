import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Check, Star, Clock, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function FoodCard({ food, onRequireAuth }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const wishlisted = isWishlisted(food.id);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!food.is_available) return;

    setAdding(true);
    const res = await addToCart(food.id, 1);
    setAdding(false);

    if (res?.requireAuth) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (res?.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(food.id);
    if (res?.requireAuth && onRequireAuth) {
      onRequireAuth();
    }
  };

  const dietaryColors = {
    veg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    vegan: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    'non-veg': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  };

  return (
    <div className="group premium-card rounded-2xl overflow-hidden flex flex-col h-full bg-lightSurface dark:bg-darkCard relative border border-black/5 dark:border-white/5">
      <Link to={`/food/${food.slug}`} className="relative aspect-[4/3] overflow-hidden block bg-slate-900">
        <img
          src={food.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-md ${dietaryColors[food.dietary] || dietaryColors['non-veg']}`}>
            {food.dietary}
          </span>
          {food.is_featured ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md grad-navy-violet text-white shadow-sm">
              Chef Pick
            </span>
          ) : null}
        </div>

        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-brandPink text-white scale-110 shadow-glow-violet'
              : 'bg-black/40 text-white/90 hover:bg-white hover:text-brandPink'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {!food.is_available && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            <span className="font-semibold text-brandViolet dark:text-brandViolet tracking-wide uppercase text-[11px]">
              {food.category_name}
            </span>
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{food.rating ? Number(food.rating).toFixed(1) : '4.8'}</span>
            </div>
          </div>

          <Link to={`/food/${food.slug}`} className="block group-hover:text-brandViolet transition-colors">
            <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText line-clamp-1 mb-1.5">
              {food.name}
            </h3>
          </Link>

          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary line-clamp-2 mb-4 leading-relaxed">
            {food.description}
          </p>
        </div>

        <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-lightText dark:text-darkText">
                ${Number(food.price).toFixed(2)}
              </span>
              {food.original_price && Number(food.original_price) > Number(food.price) && (
                <span className="text-xs text-lightTextSecondary dark:text-darkTextSecondary line-through">
                  ${Number(food.original_price).toFixed(2)}
                </span>
              )}
            </div>
            {food.prep_time_minutes && (
              <span className="text-[11px] text-lightTextSecondary dark:text-darkTextSecondary flex items-center gap-1">
                <Clock className="w-3 h-3" /> {food.prep_time_minutes}m prep
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!food.is_available || adding}
            aria-label="Add to bag"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              !food.is_available
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'grad-navy-violet text-white shadow-sm hover:opacity-95 hover:shadow-glow-violet active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
