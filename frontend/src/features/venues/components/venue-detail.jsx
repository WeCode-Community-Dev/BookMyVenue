import { MapPin, Users } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/config/paths';
import { useGetVenueByIdQuery } from '@/features/venues/api/venues-api';
import { getActiveAmenities } from '@/features/venues/utils/amenity-labels';
import { getApiErrorMessage } from '@/lib/api';

function VenueDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="aspect-[16/9] w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function VenueDetail({ venueId }) {
  const isValidId = Number.isInteger(venueId) && venueId > 0;

  const {
    data: venue,
    isLoading,
    isError,
    error,
  } = useGetVenueByIdQuery(venueId, {
    skip: !isValidId,
  });

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, 'Failed to load venue'));
    }
  }, [isError, error]);

  if (!isValidId) {
    return (
      <div className="rounded-card border border-brand-border bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-brand-text">Invalid venue</h2>
        <p className="mt-2 text-brand-muted">The venue link is not valid.</p>
        <Button asChild className="mt-6">
          <Link to={paths.home.path}>Back to search</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <VenueDetailSkeleton />;
  }

  if (isError || !venue) {
    return (
      <div className="rounded-card border border-brand-border bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-brand-text">Venue unavailable</h2>
        <p className="mt-2 text-brand-muted">This venue may not exist or the server is down.</p>
        <Button asChild className="mt-6">
          <Link to={paths.home.path}>Back to search</Link>
        </Button>
      </div>
    );
  }

  const amenities = getActiveAmenities(venue.amenities);
  const location = [venue.district, venue.city, venue.state].filter(Boolean).join(', ');

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Button asChild variant="link" className="h-auto p-0 text-brand-muted">
          <Link to={paths.home.path}>← Back to venues</Link>
        </Button>
        <h1 className="text-3xl font-semibold text-brand-text">{venue.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-4" />
            Up to {venue.capacity} guests
          </span>
        </div>
      </div>

      <div className="aspect-[16/9] overflow-hidden rounded-card bg-brand-surface">
        <div className="flex h-full items-center justify-center text-brand-muted">Venue photo gallery</div>
      </div>

      {venue.description ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-brand-text">About this venue</h2>
          <p className="leading-relaxed text-brand-muted">{venue.description}</p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-brand-text">What this place offers</h2>
        {amenities.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {amenities.map((label) => (
              <li key={label} className="rounded-md border border-brand-border px-3 py-2 text-sm">
                {label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-brand-muted">No amenities listed yet.</p>
        )}
      </section>
    </div>
  );
}
