import { PageShell } from '@/app/layout/page-shell';
import {  useGetAllBookingsQuery } from '@/features/owner/api/owner-api';

const DashNavRoutes = ['My bookings', 'New Booking'];

export function OwnerDashboardRoute() {
  return (
    <PageShell>
      <div className="grid-col gird-cols-4 grid grid-cols-[minmax(0,3fr)] gap-8">
        <aside>
        </aside>
        <section className="rounded-card border border-brand-border bg-white p-8 shadow-card">
          <h1 className="text-2xl font-semibold text-brand-text">Owner dashboard</h1>
          <p className="mt-2 text-brand-muted">Venue management and booking list arrive in Phase F5.</p>
        </section>
      </div>
    </PageShell>
  );
}

export default OwnerDashboardRoute;
