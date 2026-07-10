import { useState, useEffect } from 'react';
import { MapPin, Users, Star, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';
import travancoreImg from '@/features/public/assets/elite-travancore.png';
import emeraldImg from '@/features/public/assets/hero-venue-2.png';
import mistImg from '@/features/public/assets/hero-venue-4.png';
import FeaturedSectionSkeleton from '../loaders/FeaturedSectionSkeleton';

interface FeaturedSectionProps {
  venues: Venue[];
  loading: boolean;
}

export default function FeaturedSection({ venues, loading }: FeaturedSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const dbFeatured = venues.filter((v) => v.isFeatured);

  const fallbackFeatured = [
    {
      name: 'The Travancore Heritage Palace',
      description:
        'Experience royal luxury in an authentic heritage palace. Perfect for majestic weddings, receptions, and grand banquets with traditional Kerala architecture.',
      image: travancoreImg,
      location: 'Trivandrum, Kerala',
      capacity: '800 Guests',
      price: '₹1,50,000 / Day',
      rating: '4.9',
      tag: 'Heritage King',
    },
    {
      name: 'Emerald Water-Resort',
      description:
        'Lakeside tranquility meets modern hosting facilities. Perfect for scenic corporate getaways, private pool parties, and premium waterfront celebrations.',
      image: emeraldImg,
      location: 'Kumarakom, Kerala',
      capacity: '300 Guests',
      price: '₹1,20,000 / Day',
      rating: '4.8',
      tag: 'Waterfront Oasis',
    },
    {
      name: 'Mist-Valley Highlands',
      description:
        'Breathtaking mountain views surrounded by tea gardens. Ideal for quiet corporate retreats, wellness camps, and intimate boutique weddings in the hills.',
      image: mistImg,
      location: 'Munnar, Kerala',
      capacity: '150 Guests',
      price: '₹85,000 / Day',
      rating: '4.7',
      tag: 'Mountain Escape',
    },
  ];

  const featuredList =
    dbFeatured.length > 0
      ? dbFeatured.map((v, idx) => ({
          name: v.name,
          description: v.description || fallbackFeatured[idx % 3].description,
          image: v.images?.[0] || fallbackFeatured[idx % 3].image,
          location: v.address
            ? `${v.address.city}, ${v.address.state}`
            : fallbackFeatured[idx % 3].location,
          capacity: `${v.capacity} Guests`,
          price:
            v.availability?.pricePerHour !== undefined
              ? `₹${v.availability.pricePerHour.toLocaleString('en-IN')} / Hour`
              : fallbackFeatured[idx % 3].price,
          rating: '4.9',
          tag: v.isElite ? 'Elite Choice' : 'Featured Space',
        }))
      : fallbackFeatured;

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % featuredList.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  // Auto-play swap every 8 seconds
  useEffect(() => {
    if (loading || featuredList.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [loading, featuredList.length]);

  if (loading) {
    return <FeaturedSectionSkeleton />;
  }

  const activeVenue = featuredList[activeIdx];

  return (
    <section className="py-16 bg-transparent overflow-hidden relative w-full transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Editorial Typography (Kept as requested) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
                  Spotlight Showcase
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-black dark:text-white leading-none">
                Featured <br />
                <span className="text-[#e21a47]">Collections</span>
              </h2>
            </div>

            <div className="mt-8 pt-6 border-t border-[#e21a47]/5 dark:border-zinc-800">
              <span className="font-mono text-xs font-bold text-black dark:text-zinc-400 tracking-wider">
                ACTIVE SPACE &nbsp;//&nbsp; {String(activeIdx + 1).padStart(2, '0')}
              </span>

              <h3 className="text-2xl font-bold text-black dark:text-white mt-2 transition-colors">
                {activeVenue.name}
              </h3>

              <p className="text-sm text-black dark:text-zinc-300 mt-3 leading-relaxed min-h-[90px] transition-all duration-300">
                {activeVenue.description}
              </p>

              {/* Badges block */}
              <div className="flex flex-wrap gap-2.5 mt-6">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e21a47]/5 dark:bg-zinc-900 border border-[#e21a47]/5 dark:border-zinc-800 text-xs font-medium text-black dark:text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-[#e21a47]" />
                  <span>{activeVenue.location}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e21a47]/5 dark:bg-zinc-900 border border-[#e21a47]/5 dark:border-zinc-800 text-xs font-medium text-black dark:text-zinc-300">
                  <Users className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>{activeVenue.capacity}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e21a47]/10 text-xs font-semibold text-[#e21a47]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{activeVenue.price}</span>
                </div>
              </div>
            </div>

            {/* Slider Arrows */}
            <div className="flex items-center gap-3 mt-10">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-[#e21a47]/5 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 hover:bg-[#e21a47] hover:border-[#e21a47] text-[#e21a47] dark:text-white hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                aria-label="Previous Featured Venue"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-[#e21a47]/5 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 hover:bg-[#e21a47] hover:border-[#e21a47] text-[#e21a47] dark:text-white hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                aria-label="Next Featured Venue"
              >
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Right Side: Cinematic Parallax Viewport Slider */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            {/* Viewport Frame */}
            <div className="relative w-full aspect-[16/10] md:aspect-[16/9] lg:h-[380px] rounded-[32px] overflow-hidden border border-[#e21a47]/10 dark:border-[#e21a47]/20 hover:border-[#e21a47] dark:hover:border-[#e21a47] transition-colors duration-500 bg-zinc-950 shadow-2xl group">
              {/* Sliding Track */}
              <div
                style={{
                  transform: `translate3d(-${activeIdx * 100}%, 0, 0)`,
                }}
                className="flex w-full h-full transition-transform duration-850 cubic-bezier(0.25, 1, 0.5, 1)"
              >
                {featuredList.map((item, idx) => {
                  // Parallax horizontal shift inside the slide frame
                  const offset = (activeIdx - idx) * 40;

                  return (
                    <div key={idx} className="w-full h-full flex-shrink-0 relative overflow-hidden">
                      {/* Image container with parallax translate */}
                      <div
                        style={{
                          transform: `scale(1.08) translate3d(${offset}px, 0, 0)`,
                        }}
                        className="absolute inset-0 w-full h-full transition-transform duration-850 cubic-bezier(0.25, 1, 0.5, 1)"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      </div>

                      {/* Deep bottom gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none z-10" />

                      {/* Large Hollow Index Number Outline */}
                      <div
                        style={{
                          WebkitTextStroke: '1.5px rgba(255,255,255,0.22)',
                        }}
                        className="absolute top-6 right-8 text-transparent text-8xl font-black font-mono select-none pointer-events-none z-20 leading-none"
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      {/* Floating details inside card */}
                      <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between pointer-events-none">
                        <div>
                          <span className="bg-[#e21a47] text-white text-[8px] font-bold tracking-wider px-2.5 py-0.5 rounded uppercase mb-2 block w-fit">
                            {item.tag}
                          </span>
                          <h4 className="text-xl font-extrabold text-white leading-none">
                            {item.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-bold text-white">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Segmented Progress Timeline Indicator */}
            {featuredList.length > 1 && (
              <div className="flex gap-2 w-full px-2 mt-1">
                {featuredList.map((_, idx) => {
                  const isActive = idx === activeIdx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      style={{
                        flex: isActive ? 3 : 1,
                      }}
                      className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                        isActive
                          ? 'bg-[#e21a47]'
                          : 'bg-zinc-200 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
