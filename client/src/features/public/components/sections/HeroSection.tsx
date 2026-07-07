import { useState, useEffect } from 'react';
import heroImage1 from '@/features/public/assets/hero-venue.png';
import heroImage2 from '@/features/public/assets/hero-venue-2.png';
import heroImage3 from '@/features/public/assets/hero-venue-3.png';
import heroImage4 from '@/features/public/assets/hero-venue-4.png';
import { LocationEdit } from 'lucide-react';
import Search from '@/shared/components/ui/Search/Search';
import { useSearch } from '@/shared/hooks/useSearch';
import { searchService } from '@/shared/services/search.service';

const images = [heroImage1, heroImage2, heroImage3, heroImage4];

export default function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [query, setQuery] = useState('');

  const { suggestions, loading } = useSearch({
    query,
    fetchSuggestions:
      searchService.getVenueSuggestions
  })


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-20 min-h-[75vh] flex flex-col justify-center py-16">
      {/* Full-bleed background image carousel */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {images.map((imgSrc, idx) => (
          <img
            key={idx}
            src={imgSrc}
            alt={`Hero Banner ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover mix-blend-luminosity transition-opacity duration-1000 ease-in-out ${
              idx === currentIdx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0C10]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full relative z-10 flex flex-col justify-center">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest bg-[#e21a47] text-white">
            Premium Venue Booking
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.15] max-w-3xl">
          Find the perfect venue <br />
          <span className="font-serif italic font-light text-zinc-300">in Kerala</span>
        </h1>

        {/* Search Box */}
         <Search
          value={query}
          onChange={setQuery}
          placeholder='Search a location'
          buttonLabel='Search Venues'
          suggestions={suggestions}
          onSuggestionSelect={(venue)=>{
            console.log('Selected',venue)
          }}
          icon={
            <LocationEdit className="text-zinc-500 w-5 h-5 cursor-pointer"/>
          } onSearch={ () => {
            console.log(query)
          }}
         />

        {/* Trusted By */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-semibold tracking-wider text-zinc-500">
          <span className="uppercase text-[10px] tracking-widest text-zinc-600">Trusted By</span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-zinc-400 font-medium text-sm">
            <span className="hover:text-zinc-300 transition-colors cursor-default">
              EliteEvents
            </span>
            <span className="hover:text-zinc-300 transition-colors cursor-default">NexusCorp</span>
            <span className="hover:text-zinc-300 transition-colors cursor-default">VibeLux</span>
          </div>
        </div>
      </div>
    </section>
  );
}
