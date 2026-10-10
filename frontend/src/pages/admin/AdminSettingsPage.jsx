import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { settingsApi } from '../../services/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    restaurant_name: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    opening_hours: '',
    tax_rate_percent: 8.5,
    delivery_fee: 4.99,
    free_delivery_threshold: 50.0,
    announcement_banner: '',
    is_ordering_enabled: 1
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await settingsApi.get();
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      setSaving(true);
      const res = await settingsApi.update(settings);
      if (res.data.success) {
        setSuccess('Restaurant settings updated successfully');
        setSettings(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-brandViolet border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Establishment Configuration</span>
        <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Restaurant Settings</h2>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 text-red-500 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Restaurant Name
            </label>
            <input
              type="text"
              value={settings.restaurant_name}
              onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Direct Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Concierge Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Physical Establishment Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Operating Hours
            </label>
            <input
              type="text"
              value={settings.opening_hours}
              onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Tax Surcharge Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.tax_rate_percent}
              onChange={(e) => setSettings({ ...settings, tax_rate_percent: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Delivery Fee ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.delivery_fee}
              onChange={(e) => setSettings({ ...settings, delivery_fee: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              Free Delivery Min Order ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.free_delivery_threshold}
              onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
            Global Announcement Banner Text
          </label>
          <input
            type="text"
            value={settings.announcement_banner}
            onChange={(e) => setSettings({ ...settings, announcement_banner: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-xs font-bold text-lightText dark:text-darkText cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(settings.is_ordering_enabled)}
              onChange={(e) => setSettings({ ...settings, is_ordering_enabled: e.target.checked ? 1 : 0 })}
              className="rounded text-brandViolet focus:ring-brandViolet"
            />
            Kitchen Accepting Orders Online
          </label>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl grad-navy-violet text-white font-bold text-xs flex items-center gap-2 shadow-glow-violet hover:opacity-95"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
