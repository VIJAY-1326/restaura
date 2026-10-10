import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  Award,
  Leaf,
  Clock,
  Star,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { foodsApi, categoriesApi } from '../services/api';
import FoodCard from '../components/common/FoodCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [catsRes, featRes, popRes] = await Promise.all([
          categoriesApi.getAll(),
          foodsApi.getAll({ featured: 'true', limit: 4 }),
          foodsApi.getAll({ popular: 'true', limit: 8 })
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.data);
        if (featRes.data.success) setFeaturedFoods(featRes.data.data);
        if (popRes.data.success) setPopularFoods(popRes.data.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const renderedCategoryCards = [];
  categories.forEach((cat) => {
    renderedCategoryCards.push(
      <div
        key={cat.id}
        onClick={() => navigate(`/menu?category=${cat.slug}`)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] premium-card"
      >
        <img
          src={cat.image_url || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80'}
          alt={cat.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:from-black/90" />
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <h3 className="font-serif font-bold text-lg text-white group-hover:text-brandViolet transition-colors">
            {cat.name}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-1 mt-1 opacity-90">
            {cat.description}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-brandViolet mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Explore Course</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  });

  const renderedFeaturedCards = [];
  featuredFoods.forEach((food) => {
    renderedFeaturedCards.push(
      <FoodCard key={food.id} food={food} onRequireAuth={() => navigate('/login')} />
    );
  });

  const renderedPopularCards = [];
  popularFoods.forEach((food) => {
    renderedPopularCards.push(
      <FoodCard key={food.id} food={food} onRequireAuth={() => navigate('/login')} />
    );
  });

  const testimonials = [
    {
      quote: "Restaura marries avant-garde gastronomic technique with unpretentious ingredient purity. The Wagyu Ribeye and Truffle Burrata are transcendental.",
      author: "Julian Sterling",
      title: "Chief Gastronomy Critic, Epicurean Gazette",
      stars: 5
    },
    {
      quote: "Every plate delivered is a masterclass in balance and visual refinement. Their white-glove packaging ensures dishes arrive in immaculate cellar-to-table standard.",
      author: "Camille d'Amore",
      title: "Michelin Guide Contributor",
      stars: 5
    },
    {
      quote: "The White Truffle Tagliolini brought the warmth of Piedmont right to our private gathering. A truly unforgettable dining journey.",
      author: "Lord Marcus Vance",
      title: "Private Collector & Connoisseur",
      stars: 5
    }
  ];

  const renderedTestimonials = [];
  testimonials.forEach((item, idx) => {
    const starsArray = [];
    for (let i = 0; i < item.stars; i++) {
      starsArray.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
    }
    renderedTestimonials.push(
      <div key={idx} className="p-8 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 premium-card flex flex-col justify-between">
        <div>
          <div className="flex gap-1 mb-4">{starsArray}</div>
          <p className="font-serif italic text-sm text-lightText dark:text-darkText leading-relaxed mb-6">
            "{item.quote}"
          </p>
        </div>
        <div>
          <p className="font-bold text-sm text-lightText dark:text-darkText">{item.author}</p>
          <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">{item.title}</p>
        </div>
      </div>
    );
  });

  return (
    <div className="space-y-24 pb-20">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2000&q=85"
            alt="Restaura Ambiance"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080B12]/95 via-[#080B12]/80 to-[#080B12]/60 dark:from-[#080B12]/95 dark:via-[#080B12]/85 dark:to-[#080B12]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-left w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brandViolet/20 border border-brandViolet/40 text-brandViolet backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-violet-300">
                Culinary Perfection Redefined
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Elevated Flavors, <br />
              <span className="bg-gradient-to-r from-brandViolet via-brandBlue to-brandPink bg-clip-text text-transparent">
                Artisanal Soul.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Experience modern gastronomic art. Hand-foraged ingredients, 45-day dry-aged cuts, and slow-fermented artisan courses crafted with passionate precision.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/menu"
                className="px-8 py-4 rounded-2xl grad-navy-violet text-white font-bold text-sm flex items-center gap-3 shadow-glow-violet hover:opacity-95 transition-all transform hover:-translate-y-0.5"
              >
                Explore Tasting Menu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white backdrop-blur-md font-bold text-sm border border-white/20 transition-all"
              >
                Chef Philosophy
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg">
              <div>
                <span className="font-serif text-2xl font-bold text-white">100%</span>
                <p className="text-xs text-slate-400">Organic Sourcing</p>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white">45-Day</span>
                <p className="text-xs text-slate-400">Dry-Aged Cuts</p>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white">4.95 ★</span>
                <p className="text-xs text-slate-400">Critic Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">
              Heritage & Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-lightText dark:text-darkText leading-tight">
              A Symphony of Foraged Elements & Botanical Gastronomy
            </h2>
            <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
              Founded by master culinary artists, Restaura approaches fine dining not as mere nourishment, but as a sensory composition. From Piedmont truffles hand-shaved over slow-churned alpine butter to Japanese binchotan charcoal grilling, every culinary decision honors authenticity.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-lightElevated dark:bg-darkCard border border-black/5 dark:border-white/5 flex items-start gap-3">
                <Award className="w-5 h-5 text-brandViolet shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Master Artisans</h4>
                  <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Awarded culinary creators with international lineage.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-lightElevated dark:bg-darkCard border border-black/5 dark:border-white/5 flex items-start gap-3">
                <Leaf className="w-5 h-5 text-brandGreen shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-lightText dark:text-darkText">Ethical Sourcing</h4>
                  <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">Direct partnerships with sustainable micro-farms.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
              alt="Culinary Creation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
              <p className="font-serif italic text-sm">
                "We do not decorate dishes; we elevate nature's most honest flavors to their highest form."
              </p>
              <p className="text-xs text-slate-300 mt-2 font-bold">— Chef Laurent, Chef de Cuisine</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">
              Curated Courses
            </span>
            <h2 className="font-serif text-3xl font-bold text-lightText dark:text-darkText mt-1">
              Explore by Culinary Category
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brandViolet hover:underline"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderedCategoryCards}
        </div>
      </section>

      {featuredFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brandPink">
                Epicurean Highlights
              </span>
              <h2 className="font-serif text-3xl font-bold text-lightText dark:text-darkText mt-1">
                Chef's Signature Selections
              </h2>
            </div>
            <Link
              to="/menu?sort=rating_desc"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brandViolet hover:underline"
            >
              <span>Explore All Signatures</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderedFeaturedCards}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden grad-violet-pink p-8 sm:p-14 text-white shadow-glow-violet">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">
              Weekend Exclusive
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Complimentary Artisan Dessert on Orders Above $60
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Treat your palate to an exquisite evening. Order our signature courses and receive our hand-rolled Sicilian Pistachio Mille-Feuille or Valrhona Grand Cru Sphère on the house.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-brandViolet font-bold text-xs shadow-lg hover:bg-slate-100 transition-colors"
              >
                Order for Delivery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
            <UtensilsCrossed className="w-96 h-96 -mr-16 -mt-16 text-white" />
          </div>
        </div>
      </section>

      {popularFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brandBlue">
                Guest Favorites
              </span>
              <h2 className="font-serif text-3xl font-bold text-lightText dark:text-darkText mt-1">
                Most Celebrated Dishes
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brandViolet hover:underline"
            >
              <span>Browse Full Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderedPopularCards}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">
            Critical Praise
          </span>
          <h2 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
            What the Connoisseurs Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderedTestimonials}
        </div>
      </section>
    </div>
  );
}
