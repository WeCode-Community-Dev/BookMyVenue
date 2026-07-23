import { Link, useParams } from 'react-router-dom';

import { OwnerShell } from '@/app/layout/owner-shell';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { OwnerVenueForm } from '@/features/owner/components/owner-venue-form';
import { useGetVenueByIdQuery, useUpdateVenueMutation } from '@/features/venues/api/venues-api';

export function OwnerVenueEditRoute() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: venue, isLoading, isError } = useGetVenueByIdQuery(id);
  const [updateVenue, { isLoading: isUpdating }] = useUpdateVenueMutation();

  const isOwner = venue && user?.id === venue.ownerId;

  return (
    <OwnerShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-brand-text">Edit venue</h1>
          <p className="mt-2 text-brand-muted">Changes apply to future bookings; past bookings keep their snapshot price.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : null}

        {isError || (!isLoading && !venue) ? (
          <div className="rounded-card border border-dashed border-brand-border bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-brand-text">Venue not found</h2>
            <Button asChild className="mt-6" variant="outline">
              <Link to={paths.owner.dashboard.path}>Back to dashboard</Link>
            </Button>
          </div>
        ) : null}

        {venue && !isOwner ? (
          <div className="rounded-card border border-dashed border-brand-border bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-brand-text">You don’t own this venue</h2>
            <p className="mt-2 text-brand-muted">You can only edit venues you created.</p>
            <Button asChild className="mt-6" variant="outline">
              <Link to={paths.owner.dashboard.path}>Back to dashboard</Link>
            </Button>
          </div>
        ) : null}

        {venue && isOwner ? (
          <OwnerVenueForm mode="edit" venue={venue} isSaving={isUpdating} onSave={(payload) => updateVenue({ id: venue.id, ...payload }).unwrap()} />
        ) : null}
      </div>
    </OwnerShell>
  );
}

export default OwnerVenueEditRoute;
