import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Banknote,
  Plus,
  ShieldCheck,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { addressesApi, ordersApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    recipient_name: user?.name || '',
    phone: user?.phone || '',
    street_address: '',
    landmark: '',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94107',
    is_default: true
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    async function loadAddresses() {
      try {
        setLoading(true);
        const res = await addressesApi.getAll();
        if (res.data.success) {
          setAddresses(res.data.data);
          if (res.data.data.length > 0) {
            let defaultAddr = res.data.data[0];
            res.data.data.forEach((addr) => {
              if (addr.is_default) defaultAddr = addr;
            });
            setSelectedAddressId(defaultAddr.id);
          } else {
            setShowNewAddressForm(true);
          }
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadAddresses();
  }, [isAuthenticated, navigate, user]);

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await addressesApi.create(newAddress);
      if (res.data.success) {
        const updatedList = await addressesApi.getAll();
        setAddresses(updatedList.data.data);
        setSelectedAddressId(res.data.data.id);
        setShowNewAddressForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setError('');

    if (!selectedAddressId && !showNewAddressForm) {
      setError('Please select or provide a delivery destination.');
      return;
    }

    if (cart.items.length === 0) {
      setError('Your bag is empty.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        address_id: selectedAddressId,
        payment_method: paymentMethod,
        delivery_instructions: deliveryInstructions.trim() || undefined
      };

      const res = await ordersApi.create(payload);
      if (res.data.success) {
        await fetchCart();
        navigate(`/order-success/${res.data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please review your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderedAddressCards = [];
  addresses.forEach((addr) => {
    const isSelected = selectedAddressId === addr.id;
    renderedAddressCards.push(
      <div
        key={addr.id}
        onClick={() => setSelectedAddressId(addr.id)}
        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
          isSelected
            ? 'border-brandViolet bg-brandViolet/5 shadow-glow-violet'
            : 'border-black/5 dark:border-white/5 bg-lightElevated dark:bg-darkCard hover:border-brandViolet/40'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/10 dark:bg-white/10">
              {addr.label}
            </span>
            {addr.is_default ? (
              <span className="text-[10px] font-bold text-brandViolet">Primary</span>
            ) : null}
          </div>
          <input
            type="radio"
            name="delivery_address"
            checked={isSelected}
            onChange={() => setSelectedAddressId(addr.id)}
            className="text-brandViolet focus:ring-brandViolet"
          />
        </div>
        <p className="font-bold text-sm text-lightText dark:text-darkText mt-2">{addr.recipient_name}</p>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary mt-0.5">{addr.phone}</p>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary mt-1 leading-relaxed">
          {addr.street_address}
          {addr.landmark ? `, ${addr.landmark}` : ''}, {addr.city}, {addr.state} {addr.postal_code}
        </p>
      </div>
    );
  });

  const renderedSummaryItems = [];
  cart.items.forEach((item) => {
    renderedSummaryItems.push(
      <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brandViolet">{item.quantity}x</span>
          <span className="text-lightText dark:text-darkText line-clamp-1 max-w-[170px]">{item.food_name}</span>
        </div>
        <span className="font-semibold text-lightText dark:text-darkText">${Number(item.line_total).toFixed(2)}</span>
      </div>
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">White-Glove Service</span>
        <h1 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
          Complete Your Order
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brandViolet" />
                <h2 className="font-serif font-bold text-lg text-lightText dark:text-darkText">
                  Delivery Destination
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAddressForm((prev) => !prev)}
                className="text-xs font-bold text-brandViolet flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> {showNewAddressForm ? 'Cancel New Address' : 'Add New Address'}
              </button>
            </div>

            {showNewAddressForm ? (
              <form onSubmit={handleSaveNewAddress} className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                      Address Label
                    </label>
                    <input
                      type="text"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      placeholder="e.g. Penthouse, Office"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={newAddress.recipient_name}
                      onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                      Street Address & Apt
                    </label>
                    <input
                      type="text"
                      value={newAddress.street_address}
                      onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                      City
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                      State
                    </label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  Save & Use Address
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderedAddressCards}
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4">
            <h2 className="font-serif font-bold text-lg text-lightText dark:text-darkText">
              Delivery Notes / Concierge Instructions
            </h2>
            <textarea
              rows={3}
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="e.g. Gate code #8821, please call upon arrival at front lobby..."
              className="w-full p-3.5 rounded-2xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-xs text-lightText dark:text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
          </div>

          <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4">
            <h2 className="font-serif font-bold text-lg text-lightText dark:text-darkText">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                  paymentMethod === 'COD'
                    ? 'border-brandViolet bg-brandViolet/5 shadow-glow-violet'
                    : 'border-black/5 dark:border-white/5 bg-lightElevated dark:bg-darkCard hover:border-brandViolet/40'
                }`}
              >
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Cash on Delivery</h4>
                  <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Pay upon arrival to courier.</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                  paymentMethod === 'ONLINE'
                    ? 'border-brandViolet bg-brandViolet/5 shadow-glow-violet'
                    : 'border-black/5 dark:border-white/5 bg-lightElevated dark:bg-darkCard hover:border-brandViolet/40'
                }`}
              >
                <div className="p-3 rounded-xl bg-brandViolet/10 text-brandViolet">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Instant Card / Digital</h4>
                  <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Verified secure transaction flow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
          <h2 className="font-serif font-bold text-lg text-lightText dark:text-darkText border-b border-black/5 dark:border-white/5 pb-4">
            Order Review
          </h2>

          <div className="space-y-1">
            {renderedSummaryItems}
          </div>

          <div className="space-y-2 text-xs pt-2">
            <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
              <span>Subtotal</span>
              <span className="font-semibold text-lightText dark:text-darkText">${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
              <span>Tax (8.5%)</span>
              <span className="font-semibold text-lightText dark:text-darkText">${cart.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lightTextSecondary dark:text-darkTextSecondary">
              <span>Thermal Delivery</span>
              <span className="font-semibold text-lightText dark:text-darkText">
                {cart.deliveryFee === 0 ? 'COMPLIMENTARY' : `$${cart.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-black/5 dark:border-white/5 pt-2 flex justify-between text-base font-bold text-lightText dark:text-darkText">
              <span>Total Payable</span>
              <span className="text-brandViolet">${cart.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full py-4 rounded-2xl grad-navy-violet text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-violet hover:opacity-95 transition-all disabled:opacity-50"
          >
            {submitting ? 'Placing Culinary Order...' : 'Confirm & Place Order'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
