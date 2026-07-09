import { PageShell } from '@/app/layout/page-shell';
import { MyBookingsList } from '@/features/bookings/components/my-bookings-list';

export function MyBookingsRoute() {
  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-brand-text">My bookings</h1>
          <p className="mt-2 text-brand-muted">View and cancel your upcoming venue bookings.</p>
        </div>
        <MyBookingsList />
      </div>
    </PageShell>
  );
}

export default MyBookingsRoute;
