import { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/features/categories/types';
import weddingImg from '@/features/public/assets/category-wedding.png';
import corporateImg from '@/features/public/assets/category-corporate.png';
import getawayImg from '@/features/public/assets/category-getaway.png';
import CategoriesSectionSkeleton from '../loaders/CategoriesSectionSkeleton';

const defaultCategories = [
  {
    name: 'Weddings & Receptions',
    description:
      'Unforgettable backdrops for your special day. Discover majestic lawns, heritage halls, and sunset views.',
    image: weddingImg,
    countText: 'Curated Collection',
  },
  {
    name: 'Corporate Events',
    description:
      'State-of-the-art boardrooms and conference centers designed for peak collaboration and executive presentation.',
    image: corporateImg,
    countText: 'Executive Spaces',
  },
  {
    name: 'Private Getaways',
    description:
      "Escape to private retreats, premium houseboats, and wellness villas nestled in Kerala's scenic landscapes.",
    image: getawayImg,
    countText: 'Premium Stays',
  },
];

interface CategorySectionProps {
  categories: Category[];
  loading: boolean;
}

interface PanelProps {
  cat: {
    name: string;
    description: string;
    image: string;
    countText: string;
  };
  idx: number;
}

function CategoryPanel({ cat, idx }: PanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-[32px] border border-zinc-200/20 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900 flex-[1] hover:flex-[2.8] transition-all duration-700 ease-out group cursor-pointer h-full"
    >
      {/* Dynamic Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
        style={{
          background: `radial-gradient(circle 200px at ${spotlight.x}px ${spotlight.y}px, rgba(226, 26, 71, 0.15), transparent)`,
        }}
      />

      {/* Background Image */}
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
      />

      {/* Multi-layered Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/95 z-10" />

      {/* Main Content Container */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-20">
        {/* Top bar */}
        <div className="flex justify-between items-start">
          <span className="text-3xl font-black text-white/20 group-hover:text-[#e21a47]/60 font-mono transition-colors duration-300">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 bg-[#e21a47] text-white text-[9px] font-bold tracking-[0.15em] px-2.5 py-1 rounded-full uppercase">
            {cat.countText}
          </span>
        </div>

        {/* Bottom bar */}
        <div className="w-full">
          {/* Category Title */}
          <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-wide leading-tight group-hover:text-[#e21a47] transition-colors duration-300">
            {cat.name}
          </h3>

          {/* Description & Action Button */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
            <div className="overflow-hidden">
              <p className="text-xs text-zinc-300 mt-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 max-w-md">
                {cat.description}
              </p>
              <div className="flex items-center gap-2 mt-5 text-[10px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                <span>Explore Venues</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategorySection({ categories, loading }: CategorySectionProps) {
  const getCategoryImage = (cat: Category) => {
    if (cat.imageUrl) return cat.imageUrl;
    const name = cat.name.toLowerCase();
    if (name.includes('wed') || name.includes('marry') || name.includes('recept'))
      return weddingImg;
    if (
      name.includes('corp') ||
      name.includes('meet') ||
      name.includes('office') ||
      name.includes('business')
    )
      return corporateImg;
    return getawayImg;
  };

  const getCategoryDesc = (cat: Category) => {
    const name = cat.name.toLowerCase();
    if (name.includes('wed') || name.includes('marry') || name.includes('recept')) {
      return 'Unforgettable backdrops for your special day. Discover majestic lawns, heritage halls, and sunset views.';
    }
    if (
      name.includes('corp') ||
      name.includes('meet') ||
      name.includes('office') ||
      name.includes('business')
    ) {
      return 'State-of-the-art boardrooms and conference centers designed for peak collaboration and executive presentation.';
    }
    return "Escape to private retreats, premium houseboats, and wellness villas nestled in Kerala's scenic landscapes.";
  };

  const displayedCategories =
    categories && categories.length > 0
      ? categories.slice(0, 3).map((cat) => ({
          name: cat.name,
          description: getCategoryDesc(cat),
          image: getCategoryImage(cat),
          countText: 'Curated Spaces',
        }))
      : defaultCategories;

  if (loading) {
    return <CategoriesSectionSkeleton />;
  }

  return (
    <section className="bg-transparent text-foreground py-16 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-[#e21a47]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
              Premium Venues
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-black dark:text-white leading-none">
            Curated <br />
            <span className="text-[#e21a47]">Categories</span>
          </h2>
          <p className="text-black dark:text-zinc-400 mt-4 text-sm md:text-base leading-relaxed">
            Find the perfect environment tailored to your exact event specifications. From intimate
            social gatherings to grand corporate assemblies.
          </p>
        </div>

        <div className="mt-8 border-t border-[#e21a47]/5 dark:border-zinc-800" />

        {/* Dynamic Expanding Accordion Panels */}
        <div className="flex flex-col md:flex-row gap-5 h-[700px] md:h-[500px] w-full mt-12">
          {displayedCategories.map((cat, idx) => (
            <CategoryPanel key={`${cat.name}-${idx}`} cat={cat} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
