import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { addressesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AddressesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: 'Home',
    recipient_name: '',
    phone: '',
    street_address: '',
    landmark: '',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94107',
    is_default: false
  });
  const [error, setError] = useState('');

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressesApi.getAll();
      if (res.data.success) {
        setAddresses(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/addresses');
      return;
    }
    loadAddresses();
  }, [isAuthenticated, navigate]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      label: 'Home',
      recipient_name: '',
      phone: '',
      street_address: '',
      landmark: '',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94107',
      is_default: addresses.length === 0
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label,
      recipient_name: addr.recipient_name,
      phone: addr.phone,
      street_address: addr.street_address,
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      is_default: Boolean(addr.is_default)
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await addressesApi.update(editingId, formData);
      } else {
        await addressesApi.create(formData);
      }
      setModalOpen(false);
      loadAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressesApi.setDefault(id);
      loadAddresses();
    } catch (err) {
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this delivery address?')) return;
    try {
      await addressesApi.delete(id);
      loadAddresses();
    } catch (err) {
    }
  };

  const renderedCards = [];
  addresses.forEach((addr) => {
    renderedCards.push(
      <div
        key={addr.id}
        className={`p-6 rounded-3xl border bg-lightSurface dark:bg-darkCard flex flex-col justify-between transition-all premium-card ${
          addr.is_default ? 'border-brandViolet/50 shadow-glow-violet' : 'border-black/5 dark:border-white/5'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 text-brandViolet">
              {addr.label}
            </span>
            {addr.is_default ? (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Primary
              </span>
            ) : (
              <button
                onClick={() => handleSetDefault(addr.id)}
                className="text-xs font-semibold text-lightTextSecondary dark:text-darkTextSecondary hover:text-brandViolet"
              >
                Set as Primary
              </button>
            )}
          </div>

          <div>
            <h3 className="font-bold text-base text-lightText dark:text-darkText">{addr.recipient_name}</h3>
            <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">{addr.phone}</p>
          </div>

          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
            {addr.street_address}
            {addr.landmark ? `, ${addr.landmark}` : ''}<br />
            {addr.city}, {addr.state} {addr.postal_code}
          </p>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-end gap-2 mt-4">
          <button
            onClick={() => openEditModal(addr)}
            className="p-2 text-slate-400 hover:text-brandViolet hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
            aria-label="Edit address"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(addr.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
            aria-label="Delete address"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Concierge Destination</span>
          <h1 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
            Delivery Addresses
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-2xl grad-navy-violet text-white font-bold text-xs flex items-center gap-2 shadow-glow-violet hover:opacity-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Delivery Address
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-brandViolet border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-lightElevated dark:bg-darkCard border border-black/5 dark:border-white/5 p-8 max-w-md mx-auto space-y-4">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-lightText dark:text-darkText">No Saved Addresses</h3>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            Save your residences or venues for seamless ordering and thermal delivery.
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderedCards}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-lightSurface dark:bg-darkSurface border border-black/10 dark:border-white/10 p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-lightText dark:text-darkText">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>

            {error && (
              <p className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Recipient
                  </label>
                  <input
                    type="text"
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Street Address & Suite
                  </label>
                  <input
                    type="text"
                    value={formData.street_address}
                    onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="rounded text-brandViolet focus:ring-brandViolet"
                />
                <label htmlFor="is_default" className="text-xs font-semibold text-lightText dark:text-darkText">
                  Set as Primary Delivery Address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-400 hover:text-lightText dark:hover:text-darkText"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
