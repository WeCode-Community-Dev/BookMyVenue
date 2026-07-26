import { Link } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { CompactVenueCard } from '@/components/CompactVenueCard';
import type { PublicVenue } from '@/types/venue.types';

interface FeaturedVenuesProps {
  isLoading: boolean;
  featuredVenues: PublicVenue[];
  togglingVenues: Set<string>;
  handleToggleWishlist: (venueId: string, e: React.MouseEvent) => Promise<void>;
}

export function FeaturedVenues({
  isLoading,
  featuredVenues,
  togglingVenues,
  handleToggleWishlist,
}: FeaturedVenuesProps) {
  return (
    <section className="px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Featured Properties
              <span className="text-[var(--bg-green)]"> On Our Listing</span>
            </h2>
          </div>

          <Link
            to="/explore"
            className="px-6 py-3 border-2 border-[var(--bg-green)] text-[var(--bg-green)] rounded-xl font-medium hover:bg-[var(--bg-green)] hover:text-white transition"
          >
            View All Properties
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col h-[380px] rounded-2xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] overflow-hidden"
                >
                  <Skeleton className="w-full h-48 shrink-0" />
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </div>
              ))
            : featuredVenues
                .slice(0, 8)
                .map((venue: PublicVenue) => (
                  <CompactVenueCard
                    key={venue._id}
                    venue={venue}
                    onToggleWishlist={handleToggleWishlist}
                    isLoadingWishlist={togglingVenues.has(venue._id)}
                  />
                ))}
        </div>
      </div>
    </section>
  );
}
