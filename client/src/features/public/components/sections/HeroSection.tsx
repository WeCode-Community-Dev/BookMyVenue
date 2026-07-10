import { useState, useEffect } from 'react';
import heroImage1 from '@/features/public/assets/hero-venue.png';
import heroImage2 from '@/features/public/assets/hero-venue-2.png';
import heroImage3 from '@/features/public/assets/hero-venue-3.png';
import heroImage4 from '@/features/public/assets/hero-venue-4.png';
import { LocationEdit, Building2, MapPin, X } from 'lucide-react';
import Search from '@/shared/components/ui/Search/Search';
import { useSearch } from '@/shared/hooks/useSearch';
import { searchService } from '@/shared/services/search.service';
import { useNavigate } from 'react-router-dom';
import type { SearchSuggestion } from '@/shared/components/ui/Search/types';

const images = [heroImage1, heroImage2, heroImage3, heroImage4];

export default function HeroSection() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<SearchSuggestion | null>(null);

  const { suggestions, loading } = useSearch({
    query,
    fetchSuggestions:
      searchService.getVenueSuggestions
  });

  const suggestionsToShow = selectedVenue && query === selectedVenue.label ? [] : suggestions;

  useEffect(() => {
    if (selectedVenue && query !== selectedVenue.label) {
      setSelectedVenue(null);
    }
  }, [query, selectedVenue]);

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
          showButton={false}
          suggestions={suggestionsToShow}
          onSuggestionSelect={(venue)=>{
            setSelectedVenue(venue);
            setQuery(venue.label);
          }}
          icon={
            <LocationEdit className="text-zinc-500 w-5 h-5 cursor-pointer"/>
          } onSearch={ () => {
            console.log(query)
          }}
         />

         {/* Selected Venue Result Card */}
         {selectedVenue && (
           <div className="mt-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 max-w-3xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-[#e21a47]/10 rounded-xl text-[#e21a47]">
                 <Building2 className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white">{selectedVenue.label}</h3>
                 {selectedVenue.subtitle && (
                   <div className="flex items-center gap-1.5 mt-1 text-zinc-400 text-sm">
                     <MapPin className="w-3.5 h-3.5 text-[#e21a47]" />
                     <span>{selectedVenue.subtitle}</span>
                   </div>
                 )}
               </div>
             </div>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => {
                   navigate(`/venues/${selectedVenue.id}`);
                 }}
                 className="px-5 py-2 bg-[#e21a47] hover:bg-[#c2143b] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#e21a47]/20 cursor-pointer"
               >
                 View Venue
               </button>
               <button 
                 onClick={() => {
                   setSelectedVenue(null);
                   setQuery('');
                 }}
                 className="p-2 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors border border-zinc-700/40 cursor-pointer"
                 title="Clear Selection"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
           </div>
         )}

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
