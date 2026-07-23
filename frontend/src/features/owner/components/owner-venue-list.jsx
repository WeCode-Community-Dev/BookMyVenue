import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/config/paths';

function VenueRowSkeleton() {
  return (
    <div className="space-y-2 rounded-md border border-brand-border p-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-9 w-40" />
    </div>
  );
}

export function OwnerVenueList({ venues = [], isLoading, isDeleting, onDelete }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <VenueRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-brand-border bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-brand-text">No venues yet</h2>
        <p className="mt-2 text-brand-muted">Add your first venue so customers can book it.</p>
        <Button asChild className="mt-6">
          <Link to={paths.owner.venueNew.path}>Add venue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {venues.map((venue) => (
        <Card key={venue.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg text-brand-text">{venue.name}</CardTitle>
                <p className="mt-1 text-sm text-brand-muted">
                  {venue.city}, {venue.state}
                </p>
              </div>
              <p className="text-sm font-semibold text-brand-text">
                ₹{venue.pricePerHour}
                <span className="font-normal text-brand-muted"> / hour</span>
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={paths.venues.detail.getHref(venue.id)}>View</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={paths.owner.venueEdit.getHref(venue.id)}>Edit</Link>
            </Button>
            <Button variant="outline" size="sm" disabled={isDeleting} onClick={() => onDelete?.(venue)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
