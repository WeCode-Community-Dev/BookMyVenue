import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { OwnerShell } from '@/app/layout/owner-shell';
import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { OwnerBookingsList } from '@/features/owner/components/owner-bookings-list';
import { OwnerVenueList } from '@/features/owner/components/owner-venue-list';
import { useDeleteVenueMutation, useGetVenuesQuery } from '@/features/venues/api/venues-api';
import { getApiErrorMessage } from '@/lib/api';

export function OwnerDashboardRoute() {
  const { user } = useAuth();
  const { data: venues = [], isLoading, isError, error } = useGetVenuesQuery();
  const [deleteVenue, { isLoading: isDeleting }] = useDeleteVenueMutation();

  const myVenues = useMemo(() => venues.filter((venue) => venue.ownerId === user?.id), [venues, user?.id]);

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, 'Failed to load venues'));
    }
  }, [isError, error]);

  async function handleDelete(venue) {
    const confirmed = window.confirm(`Delete “${venue.name}”? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteVenue(venue.id).unwrap();
      toast.success('Venue deleted');
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Could not delete venue'));
    }
  }

  return (
    <OwnerShell>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-brand-text">Owner dashboard</h1>
          <p className="mt-2 text-brand-muted">Manage your venues and see bookings from customers.</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-brand-text">Your venues</h2>
          <OwnerVenueList venues={myVenues} isLoading={isLoading} isDeleting={isDeleting} onDelete={handleDelete} />
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-brand-text">Recent bookings</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to={paths.owner.listOrders.path}>View all</Link>
            </Button>
          </div>
          <OwnerBookingsList limit={5} showEmptyActions={false} />
        </section>
      </div>
    </OwnerShell>
  );
}

export default OwnerDashboardRoute;
