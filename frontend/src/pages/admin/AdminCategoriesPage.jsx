import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { categoriesApi } from '../../services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    display_order: 1,
    is_active: true
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll(true);
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      display_order: categories.length + 1,
      is_active: true
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
      display_order: cat.display_order || 1,
      is_active: Boolean(cat.is_active)
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      if (editingId) {
        await categoriesApi.update(editingId, formData);
      } else {
        await categoriesApi.create(formData);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? Dishes under this category will be affected.')) return;
    try {
      await categoriesApi.delete(id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const renderedRows = [];
  categories.forEach((cat) => {
    renderedRows.push(
      <tr key={cat.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
        <td className="py-3.5 px-4 flex items-center gap-3">
          <img
            src={cat.image_url || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=150&q=80'}
            alt={cat.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
          <div>
            <span className="font-bold text-xs text-lightText dark:text-darkText block">{cat.name}</span>
            <span className="text-[10px] text-lightTextSecondary dark:text-darkTextSecondary font-mono">{cat.slug}</span>
          </div>
        </td>
        <td className="py-3.5 px-4 text-xs text-lightTextSecondary dark:text-darkTextSecondary max-w-xs truncate">
          {cat.description || '—'}
        </td>
        <td className="py-3.5 px-4 text-xs font-bold text-center text-lightText dark:text-darkText">
          {cat.display_order}
        </td>
        <td className="py-3.5 px-4 text-center">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            cat.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {cat.is_active ? 'Active' : 'Hidden'}
          </span>
        </td>
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleOpenEdit(cat)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brandViolet hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Edit category"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(cat.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Catalog Taxonomy</span>
          <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Menu Categories</h2>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl grad-navy-violet text-white font-bold text-xs flex items-center gap-2 shadow-glow-violet hover:opacity-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase font-bold text-lightTextSecondary dark:text-darkTextSecondary">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Display Order</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderedRows}
          </tbody>
        </table>

        {categories.length === 0 && !loading && (
          <p className="py-12 text-center text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            No categories defined.
          </p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-lightSurface dark:bg-darkSurface border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-lightText dark:text-darkText">
              {editingId ? 'Edit Category' : 'Create New Category'}
            </h3>

            {error && (
              <p className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Status
                  </label>
                  <select
                    value={formData.is_active ? '1' : '0'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === '1' })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                  >
                    <option value="1">Active</option>
                    <option value="0">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                />
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
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
