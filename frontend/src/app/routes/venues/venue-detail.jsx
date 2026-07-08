import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageShell } from '@/app/layout/page-shell';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { BookingPanel } from '@/features/bookings/components/booking-panel';
import { useGetVenueByIdQuery } from '@/features/venues/api/venues-api';
import { VenueDetail } from '@/features/venues/components/venue-detail';

export function VenueDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const venueId = Number(id);
  const { isAuthenticated, role } = useAuth();

  const { data: venue, isLoading: venueLoading } = useGetVenueByIdQuery(venueId, {
    skip: !Number.isInteger(venueId) || venueId <= 0,
  });

  function handleRequireLogin() {
    toast.error('Please log in as a customer to book');
    navigate(paths.auth.login.path, {
      state: { from: { pathname: paths.venues.detail.getHref(venueId) } },
    });
  }

  function handleBookSuccess() {
    navigate(paths.bookings.mine.path);
  }

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <VenueDetail venueId={venueId} />
        <aside>
          <BookingPanel
            venueId={venueId}
            venue={venue}
            venueLoading={venueLoading}
            isAuthenticated={isAuthenticated}
            role={role}
            onRequireLogin={handleRequireLogin}
            onBookSuccess={handleBookSuccess}
          />
        </aside>
      </div>
    </PageShell>
  );
}

export default VenueDetailRoute;
