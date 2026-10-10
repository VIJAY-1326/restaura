import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { foodsApi, categoriesApi } from '../services/api';
import FoodCard from '../components/common/FoodCard';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentDietary = searchParams.get('dietary') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoriesApi.getAll();
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadDishes() {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          category_slug: currentCategory || undefined,
          dietary: currentDietary || undefined,
          search: currentSearch || undefined,
          sort: currentSort || undefined
        };
        const res = await foodsApi.getAll(params);
        if (res.data.success) {
          setFoods(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadDishes();
  }, [currentCategory, currentDietary, currentSearch, currentSort, currentPage]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const categoryFilterPills = [];
  categoryFilterPills.push(
    <button
      key="all"
      onClick={() => updateParam('category', '')}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
        !currentCategory
          ? 'grad-navy-violet text-white shadow-glow-violet'
          : 'bg-lightElevated dark:bg-darkCard text-lightTextSecondary dark:text-darkTextSecondary hover:text-lightText dark:hover:text-darkText'
      }`}
    >
      All Categories
    </button>
  );

  categories.forEach((cat) => {
    const isSelected = currentCategory === cat.slug;
    categoryFilterPills.push(
      <button
        key={cat.id}
        onClick={() => updateParam('category', cat.slug)}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
          isSelected
            ? 'grad-navy-violet text-white shadow-glow-violet'
            : 'bg-lightElevated dark:bg-darkCard text-lightTextSecondary dark:text-darkTextSecondary hover:text-lightText dark:hover:text-darkText'
        }`}
      >
        {cat.name}
      </button>
    );
  });

  const dietaryOptions = [
    { label: 'All Diets', value: '' },
    { label: 'Vegetarian', value: 'veg' },
    { label: 'Non-Vegetarian', value: 'non-veg' },
    { label: 'Plant-Based (Vegan)', value: 'vegan' }
  ];

  const dietaryButtons = [];
  dietaryOptions.forEach((opt) => {
    const active = currentDietary === opt.value;
    dietaryButtons.push(
      <button
        key={opt.value}
        onClick={() => updateParam('dietary', opt.value)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          active
            ? 'bg-brandViolet text-white shadow-sm'
            : 'text-lightTextSecondary dark:text-darkTextSecondary hover:text-lightText dark:hover:text-darkText hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        {opt.label}
      </button>
    );
  });

  const renderedFoodCards = [];
  foods.forEach((food) => {
    renderedFoodCards.push(
      <FoodCard key={food.id} food={food} onRequireAuth={() => navigate('/login')} />
    );
  });

  const paginationButtons = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    const isCurrent = i === currentPage;
    paginationButtons.push(
      <button
        key={i}
        onClick={() => updateParam('page', String(i))}
        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
          isCurrent
            ? 'grad-navy-violet text-white shadow-glow-violet'
            : 'bg-lightElevated dark:bg-darkCard text-lightText dark:text-darkText hover:bg-brandViolet/10'
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">
          Gastronomic Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-lightText dark:text-darkText">
          The Restaura Menu
        </h1>
        <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary">
          Each dish is handcrafted upon order by our master kitchen brigade using seasonal foraged produce.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search dishes, ingredients, courses..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-lightSurface dark:bg-darkCard border border-black/10 dark:border-white/10 text-sm text-lightText dark:text-darkText placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-lightText dark:hover:text-darkText"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 p-1 bg-lightElevated dark:bg-darkCard rounded-xl border border-black/5 dark:border-white/5">
              {dietaryButtons}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-lightSurface dark:bg-darkCard border border-black/10 dark:border-white/10 text-xs font-bold text-lightText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-brandViolet/50"
              >
                <option value="">Featured Ranking</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="name_asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {categoryFilterPills}
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full border-4 border-brandViolet border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-semibold text-lightTextSecondary dark:text-darkTextSecondary">
            Summoning artisanal recipes...
          </p>
        </div>
      ) : foods.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-lightElevated dark:bg-darkCard border border-black/5 dark:border-white/5 p-8 max-w-md mx-auto space-y-4">
          <SlidersHorizontal className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-lightText dark:text-darkText">No Dishes Found</h3>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
            We couldn't find any culinary dishes matching your active search filters. Try clearing your query or selecting another category.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              setSearchParams(new URLSearchParams());
            }}
            className="px-6 py-2.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-md hover:opacity-95"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderedFoodCards}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParam('page', String(currentPage - 1))}
                className="p-2 rounded-xl bg-lightElevated dark:bg-darkCard disabled:opacity-40 text-lightText dark:text-darkText hover:bg-brandViolet/10"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {paginationButtons}

              <button
                disabled={currentPage >= pagination.totalPages}
                onClick={() => updateParam('page', String(currentPage + 1))}
                className="p-2 rounded-xl bg-lightElevated dark:bg-darkCard disabled:opacity-40 text-lightText dark:text-darkText hover:bg-brandViolet/10"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
