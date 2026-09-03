import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { VenueCard } from '@/components/VenueCard';
import type { PublicVenue } from '@/types/venue.types';

interface VenueGridProps {
  venues: PublicVenue[];
  isFetching: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  togglingVenues: Set<string>;
  handleToggleWishlist: (venueId: string, e: React.MouseEvent) => Promise<void>;
  handleClearFilters: () => void;
  lastVenueElementRef: (node: HTMLDivElement | null) => void;
}

export function VenueGrid({
  venues,
  isFetching,
  isLoading,
  isFetchingNextPage,
  isError,
  togglingVenues,
  handleToggleWishlist,
  handleClearFilters,
  lastVenueElementRef,
}: VenueGridProps) {
  return (
    <div className="relative min-h-[300px]">
      {isFetching && !isLoading && !isFetchingNextPage && (
        <div className="absolute inset-0 z-10 bg-[var(--bg-primary)]/40 backdrop-blur-[2px] flex items-start justify-center pt-32 rounded-3xl">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--bg-green)]" />
        </div>
      )}
      {isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">Failed to load venues.</p>
          <p className="text-sm opacity-80">
            Please try adjusting your filters or try again later.
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row h-auto sm:min-h-[16rem] rounded-3xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] overflow-hidden"
            >
              <Skeleton className="w-full sm:w-[40%] h-52 sm:h-auto shrink-0" />
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 border rounded-md" />
                    <Skeleton className="h-6 w-16 border rounded-md" />
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-3xl border border-[var(--bg-grey)]">
          <p className="text-lg font-medium">No venues found matching your criteria.</p>
          <Button
            variant="link"
            onClick={handleClearFilters}
            className="mt-2 text-[var(--bg-green)]"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {venues.map((venue, index) => {
            const isLastItem = index === venues.length - 1;
            return (
              <div key={venue._id} ref={isLastItem ? lastVenueElementRef : null}>
                <VenueCard
                  venue={venue}
                  onToggleWishlist={handleToggleWishlist}
                  isLoadingWishlist={togglingVenues.has(venue._id)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
