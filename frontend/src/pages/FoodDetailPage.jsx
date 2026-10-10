import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Plus,
  Minus,
  Star,
  Clock,
  Flame,
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  Share2
} from 'lucide-react';
import { foodsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import FoodCard from '../components/common/FoodCard';

export default function FoodDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    async function loadDish() {
      try {
        setLoading(true);
        const res = await foodsApi.getByIdOrSlug(slug);
        if (res.data.success) {
          setFood(res.data.data);
          setQuantity(1);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadDish();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brandViolet border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
          Plating your dish preview...
        </p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Dish Not Found</h2>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          This dish may no longer be available in our seasonal catalog.
        </p>
        <Link to="/menu" className="inline-block px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md">
          Return to Menu
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(food.id);

  const handleAdd = async () => {
    if (!food.is_available) return;
    setAdding(true);
    const res = await addToCart(food.id, quantity);
    setAdding(false);

    if (res?.requireAuth) {
      navigate('/login');
      return;
    }

    if (res?.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const renderedRelated = [];
  if (food.relatedFoods && food.relatedFoods.length > 0) {
    food.relatedFoods.forEach((rel) => {
      renderedRelated.push(
        <FoodCard key={rel.id} food={rel} onRequireAuth={() => navigate('/login')} />
      );
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <Link
        to="/menu"
        className="inline-flex items-center gap-2 text-xs font-bold text-lightTextSecondary dark:text-darkTextSecondary hover:text-brandViolet dark:hover:text-brandViolet transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Full Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-black/5 dark:border-white/5">
            <img
              src={food.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                {food.dietary}
              </span>
              {food.is_featured ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider grad-navy-violet text-white shadow-sm">
                  Chef Signature
                </span>
              ) : null}
            </div>

            <button
              onClick={() => toggleWishlist(food.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                wishlisted
                  ? 'bg-brandPink text-white shadow-glow-violet'
                  : 'bg-black/50 text-white hover:bg-white hover:text-brandPink'
              }`}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link
                to={`/menu?category=${food.category_slug}`}
                className="text-xs font-bold uppercase tracking-widest text-brandViolet hover:underline"
              >
                {food.category_name}
              </Link>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{food.rating ? Number(food.rating).toFixed(2) : '4.90'}</span>
                <span className="text-lightTextSecondary dark:text-darkTextSecondary font-normal">
                  ({food.rating_count || 48} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-lightText dark:text-darkText">
              {food.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-lightText dark:text-darkText">
              ${Number(food.price).toFixed(2)}
            </span>
            {food.original_price && Number(food.original_price) > Number(food.price) && (
              <span className="text-base text-lightTextSecondary dark:text-darkTextSecondary line-through">
                ${Number(food.original_price).toFixed(2)}
              </span>
            )}
            {!food.is_available && (
              <span className="ml-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase">
                Currently Sold Out
              </span>
            )}
          </div>

          <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
            {food.description}
          </p>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-black/5 dark:border-white/5 text-center">
            <div className="p-3 rounded-2xl bg-lightElevated dark:bg-darkCard">
              <span className="block text-[11px] uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">Preparation</span>
              <span className="font-bold text-sm text-lightText dark:text-darkText flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-brandViolet" /> {food.prep_time_minutes || 20} mins
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-lightElevated dark:bg-darkCard">
              <span className="block text-[11px] uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">Calories</span>
              <span className="font-bold text-sm text-lightText dark:text-darkText flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-brandOrange" /> {food.calories || 450} kcal
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-lightElevated dark:bg-darkCard">
              <span className="block text-[11px] uppercase tracking-wider text-lightTextSecondary dark:text-darkTextSecondary">Spice Level</span>
              <span className="font-bold text-sm text-lightText dark:text-darkText capitalize mt-0.5 block">
                {food.spiciness || 'Mild'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-lightSurface dark:bg-darkSurface p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-lightText dark:text-darkText"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-lightText dark:text-darkText">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-lightText dark:text-darkText"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!food.is_available || adding}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  !food.is_available
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'grad-navy-violet text-white shadow-glow-violet hover:opacity-95'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Your Bag
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add {quantity} to Bag • ${(Number(food.price) * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-lightElevated dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-brandViolet font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Sommelier & Chef Recommendation
            </div>
            <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
              Best accompanied by our Smoked Rosemary Botanical Elixir or a vintage reserve Pinot Noir. Served at optimal culinary temperature in thermal insulation.
            </p>
          </div>
        </div>
      </div>

      {renderedRelated.length > 0 && (
        <div className="pt-12 border-t border-black/5 dark:border-white/5 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Course Harmonization</span>
            <h3 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">
              Related Dishes You May Savor
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderedRelated}
          </div>
        </div>
      )}
    </div>
  );
}
