import { Link, useNavigate } from 'react-router';
import { Heart, Snowflake } from 'lucide-react';
import { IoLocationOutline } from 'react-icons/io5';
import { useState } from 'react';
import { getLocalWishlist } from '@/hooks/useWishlist';
import type { PublicVenue } from '@/types/venue.types';

interface VenueCardProps {
  venue: PublicVenue & { wishlisted?: boolean };
  onToggleWishlist?: (venueId: string, e: React.MouseEvent) => Promise<boolean | void>;
  isLoadingWishlist?: boolean;
}

export function VenueCard({ venue, onToggleWishlist, isLoadingWishlist = false }: VenueCardProps) {
  const navigate = useNavigate();

  // Use wishlisted from venue object, or check localStorage for unauthenticated users
  const getWishlistStatus = (): boolean => {
    if (venue.wishlisted !== undefined) {
      return venue.wishlisted;
    }
    // Fallback to localStorage for unauthenticated users
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractive =
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.closest('a');

    if (!isInteractive) {
      navigate(`/venue/${venue._id}`);
    }
  };

  const getStartingPrice = (v: PublicVenue) => {
    // Try fixedPackages first
    if (v.bookingType === 'fixedBooking' && v.fixedPackages && v.fixedPackages.length > 0) {
      return Math.min(...v.fixedPackages.map((p) => p.price));
    }
    // Try pricing object
    if (v.pricing?.basePrice !== undefined && v.pricing?.basePrice !== null) {
      return v.pricing.basePrice;
    }
    return null;
  };

  const price = getStartingPrice(venue);

  return (
    <div
      onClick={handleCardClick}
      className="group overflow-hidden rounded-3xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] hover:shadow-lg transition duration-300 flex flex-col sm:flex-row sm:min-h-[16rem] cursor-pointer"
    >
      {/* Left Image */}
      <div className="relative w-full sm:w-[40%] h-52 sm:h-64 shrink-0 overflow-hidden flex">
        <img
          src={venue.coverImage}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        {onToggleWishlist && (
          <button
            onClick={handleWishlistClick}
            disabled={isLoadingWishlist}
            className="absolute top-3 right-3 p-2 bg-[var(--bg-tertiary)]/80 hover:bg-[var(--bg-tertiary)] rounded-full transition z-10 disabled:opacity-50"
            title={optimisticWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={20}
              className={
                optimisticWishlist
                  ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400'
                  : 'text-[var(--text-secondary)]'
              }
            />
          </button>
        )}
      </div>

      {/* Right Content */}
      <div className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <div className="flex flex-col flex-1">
              <Link
                to={`/venue/${venue._id}`}
                onClick={(e) => e.stopPropagation()}
                className="no-underline hover:opacity-80 transition"
              >
                <h3
                  className="text-xl font-bold text-[var(--text-primary)] line-clamp-1 uppercase"
                  title={venue.name}
                >
                  {venue.name}
                </h3>
              </Link>
              <div className="flex items-center gap-1 mt-0.5 text-sm">
                <span className="text-yellow-500 font-bold">
                  ★ {(venue.avgRating || 0).toFixed(1)}
                </span>
                <span className="text-[var(--text-secondary)] text-xs">
                  ({venue.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
            <span className="shrink-0 inline-block px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] font-bold tracking-wider rounded-full border border-orange-200 dark:border-orange-800">
              {venue.venueType}
            </span>
          </div>

          <p
            className="text-sm text-[var(--text-secondary)] flex items-center gap-1 line-clamp-1 mb-4"
            title={`${venue.city}, ${venue.district}`}
          >
            <IoLocationOutline className="shrink-0 text-[var(--text-secondary)]" size={16} />{' '}
            {venue.city}, {venue.district}
          </p>

          {/* Amenities Tags */}
          {venue.amenities && venue.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1">
              {venue.amenities.slice(0, 3).map((amenity: string) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-[var(--bg-grey)] rounded-md text-[var(--text-secondary)]"
                >
                  {amenity === 'AC' && <Snowflake size={12} />}
                  {amenity}
                </span>
              ))}
              {venue.amenities.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-[var(--bg-grey)] rounded-md text-[var(--text-secondary)]">
                  + {venue.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap justify-between items-end gap-4 mt-2 pt-2 border-t border-[var(--bg-grey)]/50">
          <div className="flex flex-col">
            {price !== null ? (
              <>
                <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-0.5">
                  Starts From
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[var(--text-primary)]">
                    ₹ {price.toLocaleString()}
                  </span>
                  {venue.bookingType === 'flexibleBooking' &&
                  venue.flexibleBooking?.slotDuration ? (
                    <span className="text-xs text-[var(--text-secondary)]">
                      / {venue.flexibleBooking.slotDuration} mins
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-secondary)]">/ slot</span>
                  )}
                </div>
                <span className="text-xs text-[var(--bg-green)] font-medium mt-1">
                  {venue.bookingType === 'fixedBooking'
                    ? 'Fixed Packages Available'
                    : 'Flexible Booking'}
                </span>
              </>
            ) : (
              <span className="text-sm text-[var(--text-secondary)]">Price on request</span>
            )}
          </div>

          <Link
            to={`/venue/${venue._id}`}
            className="shrink-0 bg-[var(--bg-green)] hover:bg-[var(--bg-green)]/90 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
