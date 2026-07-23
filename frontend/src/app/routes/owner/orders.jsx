import { OwnerShell } from '@/app/layout/owner-shell';
import { OwnerBookingsList } from '@/features/owner/components/owner-bookings-list';

export function OwnerOrdersRoute() {
  return (
    <OwnerShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-brand-text">Venue bookings</h1>
          <p className="mt-2 text-brand-muted">All confirmed and cancelled bookings across your venues.</p>
        </div>
        <OwnerBookingsList showEmptyActions={false} />
      </div>
    </OwnerShell>
  );
}

export default OwnerOrdersRoute;
