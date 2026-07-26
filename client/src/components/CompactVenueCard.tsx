import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import { MdOutlineLocationOn } from 'react-icons/md';
import { useState } from 'react';
import { getLocalWishlist } from '@/hooks/useWishlist';
import type { PublicVenue } from '@/types/venue.types';
import { Button } from '@/components/ui/button';

interface CompactVenueCardProps {
  venue: PublicVenue & { wishlisted?: boolean };
  onToggleWishlist?: (venueId: string, e: React.MouseEvent) => Promise<boolean | void>;
  isLoadingWishlist?: boolean;
}

export function CompactVenueCard({
  venue,
  onToggleWishlist,
  isLoadingWishlist = false,
}: CompactVenueCardProps) {
  const getWishlistStatus = (): boolean => {
    if (venue.wishlisted !== undefined) {
      return venue.wishlisted;
    }
    return getLocalWishlist()[venue._id] || false;
  };

  const wishlisted = getWishlistStatus();
  const [optimisticWishlist, setOptimisticWishlist] = useState(wishlisted);

  const [prevWishlisted, setPrevWishlisted] = useState(wishlisted);

  if (wishlisted !== prevWishlisted) {
    setPrevWishlisted(wishlisted);
    setOptimisticWishlist(wishlisted);
  }

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      try {
        const result = await onToggleWishlist(venue._id, e);
        if (typeof result === 'boolean') {
          setOptimisticWishlist(result);
        }
      } catch (err) {
        console.error('Failed to toggle wishlist:', err);
      }
    }
  };

  const getStartingPrice = (v: PublicVenue) => {
    if (v.bookingType === 'fixedBooking' && v.fixedPackages && v.fixedPackages.length > 0) {
      return Math.min(...v.fixedPackages.map((p) => p.price));
    }
    if (v.pricing?.basePrice !== undefined && v.pricing?.basePrice !== null) {
      return v.pricing.basePrice;
    }
    return null;
  };

  const price = getStartingPrice(venue);

  return (
    <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--bg-grey)] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
      <div className="relative h-48 w-full bg-[var(--bg-grey)] overflow-hidden">
        {venue.coverImage ? (
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
            No Image
          </div>
        )}

        {onToggleWishlist && (
          <button
            onClick={handleWishlistClick}
            disabled={isLoadingWishlist}
            className="absolute top-3 right-3 p-2 bg-[var(--bg-tertiary)]/80 hover:bg-[var(--bg-tertiary)] rounded-full transition z-10 disabled:opacity-50"
            title={optimisticWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={18}
              className={
                optimisticWishlist
                  ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400'
                  : 'text-[var(--text-secondary)]'
              }
            />
          </button>
        )}

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-black/60 text-white backdrop-blur-sm border border-white/20">
            {venue.venueType || 'Venue'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-lg font-bold text-[var(--text-primary)] truncate" title={venue.name}>
            {venue.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 text-sm mt-0.5">
            <span className="text-yellow-500 font-bold">★</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {(venue.avgRating || 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center text-[var(--text-secondary)] text-sm mb-4">
          <MdOutlineLocationOn className="mr-1 text-lg shrink-0" />
          <span className="truncate" title={`${venue.city}, ${venue.district}`}>
            {venue.city}, {venue.district}
          </span>
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-3">
          {price !== null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-[var(--text-secondary)] font-medium">From</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">
                ₹{price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Price on request
            </span>
          )}

          <Button
            className="w-full h-10 bg-[var(--bg-green)] hover:bg-[var(--bg-green)]/90 text-white shadow-md font-semibold"
            asChild
          >
            <Link to={`/venue/${venue._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
