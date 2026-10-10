import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  SlidersHorizontal,
  Flame,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { foodsApi, categoriesApi } from '../../services/api';

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    dietary: 'non-veg',
    calories: '',
    prep_time_minutes: '20',
    spiciness: 'mild',
    is_available: true,
    is_featured: false,
    is_popular: false
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [foodsRes, catsRes] = await Promise.all([
        foodsApi.getAll({ includeUnavailable: 'true', limit: 100, search: search || undefined, category_id: selectedCategory || undefined }),
        categoriesApi.getAll(true)
      ]);
      if (foodsRes.data.success) setFoods(foodsRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      price: '',
      original_price: '',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      dietary: 'non-veg',
      calories: '450',
      prep_time_minutes: '20',
      spiciness: 'mild',
      is_available: true,
      is_featured: false,
      is_popular: false
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (food) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      category_id: food.category_id,
      description: food.description || '',
      price: String(food.price),
      original_price: food.original_price ? String(food.original_price) : '',
      image_url: food.image_url || '',
      dietary: food.dietary || 'non-veg',
      calories: food.calories ? String(food.calories) : '',
      prep_time_minutes: food.prep_time_minutes ? String(food.prep_time_minutes) : '20',
      spiciness: food.spiciness || 'mild',
      is_available: Boolean(food.is_available),
      is_featured: Boolean(food.is_featured),
      is_popular: Boolean(food.is_popular)
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
        await foodsApi.update(editingId, formData);
      } else {
        await foodsApi.create(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save dish');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const res = await foodsApi.toggleAvailability(id);
      if (res.data.success) {
        const nextFoods = [];
        foods.forEach((f) => {
          if (f.id === id) {
            nextFoods.push({ ...f, is_available: res.data.is_available ? 1 : 0 });
          } else {
            nextFoods.push(f);
          }
        });
        setFoods(nextFoods);
      }
    } catch (err) {
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dish permanently from the menu?')) return;
    try {
      await foodsApi.delete(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete dish');
    }
  };

  const renderedCategoryOptions = [];
  categories.forEach((cat) => {
    renderedCategoryOptions.push(
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    );
  });

  const renderedRows = [];
  foods.forEach((food) => {
    renderedRows.push(
      <tr key={food.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
        <td className="py-3.5 px-4 flex items-center gap-3">
          <img
            src={food.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&q=80'}
            alt={food.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
          <div>
            <span className="font-bold text-xs text-lightText dark:text-darkText block">{food.name}</span>
            <span className="text-[10px] uppercase font-bold text-brandViolet">{food.category_name}</span>
          </div>
        </td>
        <td className="py-3.5 px-4 text-xs font-bold text-lightText dark:text-darkText">
          ${Number(food.price).toFixed(2)}
        </td>
        <td className="py-3.5 px-4 text-xs capitalize text-lightTextSecondary dark:text-darkTextSecondary">
          {food.dietary}
        </td>
        <td className="py-3.5 px-4 text-center">
          <button
            onClick={() => handleToggleAvailability(food.id)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mx-auto transition-colors ${
              food.is_available
                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
            }`}
          >
            {food.is_available ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {food.is_available ? 'Available' : 'Sold Out'}
          </button>
        </td>
        <td className="py-3.5 px-4 text-center">
          {food.is_featured ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase grad-navy-violet text-white">
              Chef Pick
            </span>
          ) : (
            <span className="text-slate-400 text-xs">—</span>
          )}
        </td>
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleOpenEdit(food)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brandViolet hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Edit dish"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(food.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete dish"
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
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Catalog Management</span>
          <h2 className="font-serif text-2xl font-bold text-lightText dark:text-darkText">Dishes & Menu Offerings</h2>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl grad-navy-violet text-white font-bold text-xs flex items-center gap-2 shadow-glow-violet hover:opacity-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Dish
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-lightElevated dark:bg-darkSurface border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50 w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {renderedCategoryOptions}
          </select>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase font-bold text-lightTextSecondary dark:text-darkTextSecondary">
              <th className="py-3 px-4">Dish Details</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Dietary</th>
              <th className="py-3 px-4 text-center">Availability</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderedRows}
          </tbody>
        </table>

        {foods.length === 0 && !loading && (
          <p className="py-12 text-center text-xs text-lightTextSecondary dark:text-darkTextSecondary">
            No dishes matching your criteria.
          </p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-3xl bg-lightSurface dark:bg-darkSurface border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-lightText dark:text-darkText">
              {editingId ? 'Edit Dish Details' : 'Create New Dish'}
            </h3>

            {error && (
              <p className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Dish Name
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
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  >
                    <option value="">Select Category</option>
                    {renderedCategoryOptions}
                  </select>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Original Price ($) (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Dietary Classification
                  </label>
                  <select
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.prep_time_minutes}
                    onChange={(e) => setFormData({ ...formData, prep_time_minutes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                    Spice Level
                  </label>
                  <select
                    value={formData.spiciness}
                    onChange={(e) => setFormData({ ...formData, spiciness: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                    <option value="extra-hot">Extra Hot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-lightElevated dark:bg-darkCard border border-black/10 dark:border-white/10 text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-lightText dark:text-darkText cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded text-brandViolet focus:ring-brandViolet"
                  />
                  Available for Ordering
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-lightText dark:text-darkText cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-brandViolet focus:ring-brandViolet"
                  />
                  Featured Chef Pick
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-lightText dark:text-darkText cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="rounded text-brandViolet focus:ring-brandViolet"
                  />
                  Popular Highlight
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
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  {saving ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
