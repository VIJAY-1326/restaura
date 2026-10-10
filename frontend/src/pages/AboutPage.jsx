import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Leaf, Flame, ShieldCheck, ArrowRight, UtensilsCrossed } from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      title: 'Biodynamic Sourcing',
      desc: 'Partnered with independent Northern California micro-farms delivering organic heirloom vegetables within 12 hours of harvest.',
      icon: Leaf
    },
    {
      title: 'Artisan Dry-Aging',
      desc: 'Our cellar features Himalayan salt-brick chambers aging prime Miyazaki Wagyu and heritage Angus beef for up to 45 days.',
      icon: Award
    },
    {
      title: 'Binchotan Fire Art',
      desc: 'Dishes are grilled over Japanese white charcoal reaching 1,800°F without smoke impurities, sealing in rich natural juices.',
      icon: Flame
    },
    {
      title: 'Thermal Containment',
      desc: 'Custom-designed ceramic-core delivery cases guarantee each delivered course arrives at precise cellar-to-table temperature.',
      icon: ShieldCheck
    }
  ];

  const renderedPillars = [];
  pillars.forEach((p, idx) => {
    const IconComponent = p.icon;
    renderedPillars.push(
      <div key={idx} className="p-8 rounded-3xl bg-lightSurface dark:bg-darkCard border border-black/5 dark:border-white/5 space-y-4 premium-card">
        <div className="w-12 h-12 rounded-2xl grad-navy-violet flex items-center justify-center text-white shadow-glow-violet">
          <IconComponent className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-lg text-lightText dark:text-darkText">{p.title}</h3>
        <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">{p.desc}</p>
      </div>
    );
  });

  return (
    <div className="space-y-20 pb-20">
      <section className="relative py-24 bg-lightElevated dark:bg-darkCard border-b border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">
            The Restaura Chronicle
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-lightText dark:text-darkText">
            Where Haute Cuisine Meets Modern Accessibility
          </h1>
          <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary max-w-2xl mx-auto leading-relaxed">
            Founded in 2021 by Chef Laurent and an international collective of Michelin-pedigree culinary artists, Restaura was conceived to bring the uncompromising discipline of 3-star dining directly to your table.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80"
              alt="Executive Chef"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brandPink">Culinary Lineage</span>
            <h2 className="font-serif text-3xl font-bold text-lightText dark:text-darkText leading-tight">
              Curated by Chef Laurent & Master Brigade
            </h2>
            <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
              Trained across Lyon, Tokyo, and San Francisco, Chef Laurent believes that simplicity is the ultimate sophistication. Our sauces simmer for 36 hours. Our pasta dough uses 30 egg yolks per kilo of stone-milled Italian flour. We preserve culinary integrity with uncompromising passion.
            </p>
            <p className="text-sm text-lightTextSecondary dark:text-darkTextSecondary leading-relaxed">
              Every order prepared in our kitchens receives the exact same rigorous inspection as a plated course in our private dining room.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl grad-navy-violet text-white text-xs font-bold shadow-glow-violet hover:opacity-95"
              >
                Experience the Menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brandViolet">Our Guiding Tenets</span>
          <h2 className="font-serif text-3xl font-bold text-lightText dark:text-darkText">
            The Four Pillars of Restaura
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderedPillars}
        </div>
      </section>
    </div>
  );
}
