import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageShell } from '@/app/layout/page-shell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { BookingPanel } from '@/features/bookings/components/booking-panel';
import { useGetVenueByIdQuery } from '@/features/venues/api/venues-api';
import { VenueDetail } from '@/features/venues/components/venue-detail';

export function VenueDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const venueId = Number(id);
  const { isAuthenticated, role, user } = useAuth();

  const { data: venue, isLoading: venueLoading } = useGetVenueByIdQuery(venueId, {
    skip: !Number.isInteger(venueId) || venueId <= 0,
  });

  const isOwnerViewer = role === 'OWNER';
  const ownsThisVenue = isOwnerViewer && venue && user?.id === venue.ownerId;

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
      <div className={isOwnerViewer ? 'space-y-6' : 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]'}>
        <VenueDetail venueId={venueId} />
        {isOwnerViewer ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-text">Owner preview</CardTitle>
              <CardDescription>Owner accounts can’t book venues. Use your dashboard to manage listings.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to={paths.owner.dashboard.path}>Go to dashboard</Link>
              </Button>
              {ownsThisVenue ? (
                <Button asChild variant="outline">
                  <Link to={paths.owner.venueEdit.getHref(venueId)}>Edit this venue</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>
    </PageShell>
  );
}

export default VenueDetailRoute;
