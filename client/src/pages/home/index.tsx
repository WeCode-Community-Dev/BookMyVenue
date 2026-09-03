import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import {
  IoBusinessOutline,
  IoCameraOutline,
  IoCafeOutline,
  IoStarOutline,
  IoHomeOutline,
  IoLeafOutline,
  IoCheckmarkCircle,
} from 'react-icons/io5';

import { useApiQuery } from '@/hooks/useApi';
import { API_ENDPOINTS } from '@/constants';
import { useToggleWishlist, useWishlistSync } from '@/hooks/useWishlist';
import type { PublicVenue } from '@/types/venue.types';

import { HeroSection } from './components/HeroSection';
import { FeaturedVenues } from './components/FeaturedVenues';

const VENUE_CATEGORIES = [
  { name: 'Wedding Halls', icon: IoStarOutline, value: 'Wedding Hall' },
  { name: 'Corporate Spaces', icon: IoBusinessOutline, value: 'Corporate Space' },
  { name: 'Party Lawns', icon: IoLeafOutline, value: 'Party Lawn' },
  { name: 'Banquet Halls', icon: IoCafeOutline, value: 'Banquet Hall' },
  { name: 'Studios', icon: IoCameraOutline, value: 'Studio' },
  { name: 'Resorts', icon: IoHomeOutline, value: 'Resort' },
];

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [togglingVenues, setTogglingVenues] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  const { toggleWishlist: toggleWishlistFn } = useToggleWishlist();
  useWishlistSync();

  const handleSearch = () => {
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      navigate(`/explore?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      navigate('/explore');
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/explore?venueTypes=${encodeURIComponent(category)}`);
  };

  const {
    data: featuredVenues = [],
    isLoading,
    isSuccess,
  } = useApiQuery<PublicVenue[]>(['featured-venues'], {
    method: 'GET',
    url: API_ENDPOINTS.FEATURED_VENUES,
  });

  const handleToggleWishlist = useCallback(
    async (venueId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setTogglingVenues((prev) => new Set([...prev, venueId]));

      try {
        await toggleWishlistFn(venueId);
      } finally {
        setTogglingVenues((prev) => {
          const next = new Set(prev);
          next.delete(venueId);
          return next;
        });
      }
    },
    [toggleWishlistFn]
  );

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="px-4 md:px-6 lg:px-8 pt-22 pb-8">
        <HeroSection search={search} setSearch={setSearch} handleSearch={handleSearch} />

        {/* Features Strip */}
        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 animate-fade-in-up-delay">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-2">
              <IoCheckmarkCircle className="text-[var(--bg-green)] text-2xl" />
              <h3 className="font-semibold text-[var(--text-primary)]">Verified Venues</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Handpicked and verified spaces for your perfect event.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l border-[var(--bg-grey)] md:pl-6">
            <div className="flex items-center gap-3 mb-2">
              <IoBusinessOutline className="text-[var(--bg-green)] text-2xl" />
              <h3 className="font-semibold text-[var(--text-primary)]">Transparent Pricing</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              What you see is what you pay. No hidden fees.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l border-[var(--bg-grey)] md:pl-6">
            <div className="flex items-center gap-3 mb-2">
              <IoStarOutline className="text-[var(--bg-green)] text-2xl" />
              <h3 className="font-semibold text-[var(--text-primary)]">Instant Booking</h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Secure your date instantly with a seamless checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--bg-grey)] to-transparent" />
      </div>

      {/* Categories Showcase */}
      <section className="px-6 py-12 border-b border-[var(--bg-grey)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
              Browse by Category
            </h2>
            <p className="text-[var(--text-secondary)]">
              Find the perfect space tailored to your specific event needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {VENUE_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.value)}
                className="flex flex-col items-center justify-center p-6 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--bg-grey)] hover:shadow-md hover:border-[var(--bg-green)] transition cursor-pointer group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--bg-green)]/10 text-[var(--bg-green)] group-hover:bg-[var(--bg-green)] group-hover:text-white transition-colors mb-4">
                  <cat.icon size={24} />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues Section — only shown when API succeeded with results */}
      {(isLoading || (isSuccess && featuredVenues.length > 0)) && (
        <FeaturedVenues
          isLoading={isLoading}
          featuredVenues={featuredVenues}
          togglingVenues={togglingVenues}
          handleToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Become a Host Section */}
      <section className="px-6 py-16 bg-[var(--bg-tertiary)] border-y border-[var(--bg-grey)]">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              List Your Property on BookMyVenue
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
              Have a beautiful space? Join thousands of hosts who are earning by renting out their
              venues for events, meetings, and parties.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/list-venue/add-venue"
              className="inline-block px-8 py-4 bg-[var(--bg-green)] text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Discover BookMyVenue Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              Discover More About <br className="hidden md:block" /> Property Rental
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed text-lg">
              BookMyVenue provides a seamless experience for both guests looking to book the perfect
              space and hosts wanting to maximize their property's potential.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Verified venues with detailed amenities',
                'Transparent pricing with no hidden fees',
                'Secure payment and instant booking confirmation',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <IoCheckmarkCircle className="text-[var(--bg-green)] text-xl shrink-0" />
                  <span className="text-[var(--text-primary)] font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/explore"
              className="inline-block px-8 py-3 bg-[var(--bg-green)] hover:bg-[var(--text-primary)] text-white font-semibold rounded-full transition shadow-md"
            >
              Discover More
            </Link>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video lg:aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
                alt="Beautiful event space"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
