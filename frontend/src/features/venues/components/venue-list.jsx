import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useGetVenuesQuery } from '@/features/venues/api/venues-api';
import { VenueCard } from '@/features/venues/components/venue-card';
import { VenueCardSkeleton } from '@/features/venues/components/venue-card-skeleton';
import { VenueSearch } from '@/features/venues/components/venue-search';
import { getApiErrorMessage } from '@/lib/api';

export function VenueList() {
  const [cityFilter, setCityFilter] = useState('');

  const { data: venues = [], isLoading, isFetching, isError, error } = useGetVenuesQuery(cityFilter ? { city: cityFilter } : {});

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, 'Failed to load venues'));
    }
  }, [isError, error]);

  const showSkeletons = isLoading;
  const showEmpty = !showSkeletons && venues.length === 0;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-brand-text">Find your next venue</h1>
        <p className="max-w-2xl text-brand-muted">Browse venues by city. Same-day hourly booking opens in the next phase.</p>
      </div>

      <VenueSearch onSearch={setCityFilter} isLoading={isFetching} />

      {cityFilter ? (
        <p className="text-sm text-brand-muted">
          Showing results for <span className="font-medium text-brand-text">{cityFilter}</span>
        </p>
      ) : null}

      {showSkeletons ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <VenueCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {showEmpty ? (
        <div className="rounded-card border border-dashed border-brand-border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-brand-text">No venues found</h2>
          <p className="mt-2 text-brand-muted">
            {cityFilter ? 'Try another city or clear the filter to see all venues.' : 'No venues have been listed yet.'}
          </p>
        </div>
      ) : null}

      {!showSkeletons && venues.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
