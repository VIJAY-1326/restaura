import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const renderedCartItems = [];
  if (cart.items && cart.items.length > 0) {
    cart.items.forEach((item) => {
      renderedCartItems.push(
        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-lightElevated dark:bg-darkCard border border-black/5 dark:border-white/5 transition-all">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
            alt={item.food_name}
            className="w-20 h-20 rounded-xl object-cover shrink-0"
          />
          <div className="flex flex-col justify-between flex-grow">
            <div className="flex justify-between items-start gap-2">
              <h4 className="font-serif font-bold text-sm text-lightText dark:text-darkText line-clamp-1">
                {item.food_name}
              </h4>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-sm text-lightText dark:text-darkText">
                ${Number(item.line_total).toFixed(2)}
              </span>

              <div className="flex items-center border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-lightSurface dark:bg-darkSurface">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5 text-lightText dark:text-darkText transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-xs font-bold text-lightText dark:text-darkText">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5 text-lightText dark:text-darkText transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-lightSurface dark:bg-darkSurface border-l border-black/5 dark:border-white/5 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brandViolet" />
              <h2 className="font-serif font-bold text-lg text-lightText dark:text-darkText">
                Your Epicurean Bag ({cart.totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-lightText dark:hover:text-darkText hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items && cart.items.length > 0 ? (
              renderedCartItems
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-brandViolet/10 flex items-center justify-center text-brandViolet mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-lightText dark:text-darkText mb-1">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary max-w-xs mb-6">
                  Explore our seasonal menu and select your handcrafted culinary dishes.
                </p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/menu');
                  }}
                  className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  Explore Dishes
                </button>
              </div>
            )}
          </div>

          {cart.items && cart.items.length > 0 && (
            <div className="p-6 border-t border-black/5 dark:border-white/5 bg-lightElevated dark:bg-darkCard space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-lightText dark:text-darkText">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-lightText dark:text-darkText">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
                  <span>White-Glove Delivery</span>
                  <span className="font-semibold text-lightText dark:text-darkText">
                    {cart.deliveryFee === 0 ? 'COMPLIMENTARY' : `$${cart.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-lightText dark:text-darkText pt-2 border-t border-black/5 dark:border-white/5">
                  <span>Grand Total</span>
                  <span className="text-brandViolet">${cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3 rounded-xl grad-navy-violet text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-violet hover:opacity-95 transition-opacity"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-lightText dark:text-darkText hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  View Full Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
