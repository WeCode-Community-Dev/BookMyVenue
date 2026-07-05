import { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PlaceCard } from '@/components/ui/card-22';
import type { Venue } from '../data/venuesData';

const capacityOptions = [
  { value: 'All', label: 'Any Capacity' },
  { value: '10', label: 'Intimate (Up to 10)' },
  { value: '100', label: 'Medium (Up to 100)' },
  { value: '1000', label: 'Large (1000+)' },
];

const sortOptions = [
  { value: 'Default', label: 'Default Sorting' },
  { value: 'PriceAsc', label: 'Price: Low to High' },
  { value: 'PriceDesc', label: 'Price: High to Low' },

];

export default function Venues() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedCapacity, setSelectedCapacity] = useState<string>('All');
  const [capacityDropdownOpen, setCapacityDropdownOpen] = useState<boolean>(false);

  // Search & Sort States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Default');
  const [sortDropdownOpen, setSortDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/venues');
        if (response.ok) {
          const data = await response.json();
          setVenues(data);
        } else {
          setVenues([]);
        }
      } catch (err) {
        console.error('Failed to fetch venues from backend:', err);
        setVenues([]);
      }
    };
    fetchVenues();
  }, []);

  // Compute location options dynamically from existing venues
  const uniqueCities = Array.from(new Set(venues.map(v => v.location))).filter(Boolean);
  const locationOptions = [
    { value: 'All', label: 'All Locations' },
    ...uniqueCities.map(city => ({ value: city, label: city }))
  ];

  // Filter and sort venues based on states
  const filteredAndSortedVenues = venues
    .filter((venue) => {
      const matchesLocation = selectedLocation === 'All' || venue.location === selectedLocation;

      let matchesCapacity = true;
      if (selectedCapacity === '10') {
        matchesCapacity = venue.capacity <= 10;
      } else if (selectedCapacity === '100') {
        matchesCapacity = venue.capacity > 10 && venue.capacity <= 100;
      } else if (selectedCapacity === '1000') {
        matchesCapacity = venue.capacity >= 1000;
      }

      const matchesSearch = searchQuery.trim() === '' ||
        venue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesLocation && matchesCapacity && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'PriceAsc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'PriceDesc') return b.pricePerNight - a.pricePerNight;

      return 0; // Default
    });

  const activeLocationOption = locationOptions.find((opt) => opt.value === selectedLocation) || locationOptions[0];
  const activeCapacityOption = capacityOptions.find((opt) => opt.value === selectedCapacity) || capacityOptions[0];
  const activeSortOption = sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];

  return (
    <section
      className="relative w-full min-h-screen text-white pb-16 overflow-y-auto"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      {/* Navigation */}
      <Navbar />

      {/* Gradients */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center pt-32 sm:pt-40 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">

        {/* Title and Subtitle */}
        <div className="text-center mb-10 sm:mb-12">
          <h1
            className="font-normal leading-[0.95] text-white text-[2.5rem] sm:text-5xl md:text-6xl max-w-4xl tracking-tight"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: '-0.035em' }}
          >
            Event{' '}
            <span className="text-[#c5a059]">
              Venues
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-white/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Discover handpicked, beautiful locations perfect for your next event, wedding, or celebration.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full max-w-lg mb-8 z-30">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search venues by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-black/60 hover:bg-black/80 focus:bg-black/90 border border-white/10 focus:border-[#c5a059]/50 rounded-full text-white text-sm focus:outline-none transition-all duration-300 shadow-md placeholder-white/30"
          />
        </div>

        {/* Filter Dropdowns Container */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16 z-30">

          {/* Location Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setDropdownOpen((prev) => !prev);
                setCapacityDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-4 px-6 py-3 min-w-[220px] bg-black/60 hover:bg-black/80 border border-white/10 rounded-full text-white text-sm font-semibold shadow-md transition-all duration-300 active:scale-[0.98]"
              aria-label="Filter locations dropdown"
              aria-expanded={dropdownOpen}
            >
              <span>{activeLocationOption.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#c5a059] transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setDropdownOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d11]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  {locationOptions.map((option) => {
                    const isActive = selectedLocation === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedLocation(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm transition-colors duration-200 ${isActive
                          ? 'bg-[#c5a059] text-white font-semibold'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Capacity Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setCapacityDropdownOpen((prev) => !prev);
                setDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-4 px-6 py-3 min-w-[220px] bg-black/60 hover:bg-black/80 border border-white/10 rounded-full text-white text-sm font-semibold shadow-md transition-all duration-300 active:scale-[0.98]"
              aria-label="Filter capacities dropdown"
              aria-expanded={capacityDropdownOpen}
            >
              <span>{activeCapacityOption.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#c5a059] transition-transform duration-300 ${capacityDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {capacityDropdownOpen && (
              <>
                <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setCapacityDropdownOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d11]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  {capacityOptions.map((option) => {
                    const isActive = selectedCapacity === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCapacity(option.value);
                          setCapacityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm transition-colors duration-200 ${isActive
                          ? 'bg-[#c5a059] text-white font-semibold'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSortDropdownOpen((prev) => !prev);
                setDropdownOpen(false);
                setCapacityDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-4 px-6 py-3 min-w-[220px] bg-black/60 hover:bg-black/80 border border-white/10 rounded-full text-white text-sm font-semibold shadow-md transition-all duration-300 active:scale-[0.98]"
              aria-label="Sort venues dropdown"
              aria-expanded={sortDropdownOpen}
            >
              <span>{activeSortOption.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#c5a059] transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {sortDropdownOpen && (
              <>
                <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setSortDropdownOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d11]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  {sortOptions.map((option) => {
                    const isActive = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm transition-colors duration-200 ${isActive
                          ? 'bg-[#c5a059] text-white font-semibold'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        </div>

        {/* Venue Grid (Filtered Venues) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center w-full max-w-4xl pb-12">
          {filteredAndSortedVenues.map((venue, idx) => (
            <PlaceCard
              key={idx}
              images={venue.images}
              tags={venue.tags}
              rating={venue.rating}
              title={venue.title}
              description={venue.description}
              capacity={venue.capacity}
              eventTypes={venue.eventTypes}
              className="border-white/10 bg-black/40 backdrop-blur-md shadow-2xl"
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (user?.role === 'venue_owner') {
                  navigate('/my-venues/' + venue.id);
                } else {
                  navigate('/venue/' + venue.id);
                }
              }}
            />
          ))}
          {filteredAndSortedVenues.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center text-white/50 py-12">
              No venues match your location, capacity, or search criteria.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
