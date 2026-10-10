import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brandViolet/10 flex items-center justify-center text-brandViolet mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Sign In to View Bag</h2>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          Please sign in to access your saved culinary selections and proceed to checkout.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brandViolet/10 flex items-center justify-center text-brandViolet mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Your Bag is Empty</h2>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
          Indulge in our exquisite tasting courses, dry-aged steaks, and artisanal pastas.
        </p>
        <Link to="/menu" className="inline-block px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md">
          Explore Our Menu
        </Link>
      </div>
    );
  }

  const renderedCartRows = [];
  cart.items.forEach((item) => {
    renderedCartRows.push(
      <div
        key={item.id}
        className="p-5 rounded-2xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center gap-5 transition-all premium-card"
      >
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
          alt={item.food_name}
          className="w-24 h-24 rounded-2xl object-cover shrink-0"
        />

        <div className="flex-1 text-center sm:text-left">
          <Link to={`/food/${item.food_id}`} className="hover:text-brandViolet transition-colors">
            <h3 className="font-serif font-bold text-base text-lightText dark:text-darkText">
              {item.food_name}
            </h3>
          </Link>
          <span className="text-xs text-brandViolet font-semibold tracking-wide uppercase">
            ${Number(item.price).toFixed(2)} each
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-lightElevated dark:bg-darkSurface">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 text-lightText dark:text-darkText"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold text-lightText dark:text-darkText">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 text-lightText dark:text-darkText"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right min-w-[70px]">
            <span className="font-bold text-base text-lightText dark:text-darkText block">
              ${Number(item.line_total).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  });

  const diffForFreeDelivery = Number(cart.freeDeliveryThreshold || 50) - cart.subtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Order Review</span>
          <h1 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
            Your Epicurean Bag ({cart.totalItemsCount})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-500 hover:underline"
        >
          Clear Entire Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-4">
          {renderedCartRows}
          <div className="pt-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold text-brandViolet hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Add More Dishes from Menu
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
          <h2 className="font-serif font-bold text-lg text-lightText dark:text-darkText border-b border-black/5 dark:border-white/5 pb-4">
            Order Summary
          </h2>

          {diffForFreeDelivery > 0 ? (
            <div className="p-3.5 rounded-2xl bg-brandViolet/10 text-xs text-brandViolet font-semibold">
              Add <span className="font-bold">${diffForFreeDelivery.toFixed(2)}</span> more to unlock complimentary white-glove delivery!
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Complimentary White-Glove Delivery Unlocked!
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
              <span>Courses Subtotal</span>
              <span className="font-semibold text-lightText dark:text-darkText">${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
              <span>Sales Tax & Surcharge</span>
              <span className="font-semibold text-lightText dark:text-darkText">${cart.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
              <span>Thermal Delivery Service</span>
              <span className="font-semibold text-lightText dark:text-darkText">
                {cart.deliveryFee === 0 ? 'COMPLIMENTARY' : `$${cart.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-black/5 dark:border-white/5 pt-3 flex justify-between text-lg font-bold text-lightText dark:text-darkText">
              <span>Total Payable</span>
              <span className="text-brandViolet">${cart.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-2xl grad-navy-violet text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-violet hover:opacity-95 transition-opacity"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
