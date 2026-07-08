import { PageShell } from '@/app/layout/page-shell';

export function OwnerDashboardRoute() {
  return (
    <PageShell>
      <section className="rounded-card border border-brand-border bg-white p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-brand-text">Owner dashboard</h1>
        <p className="mt-2 text-brand-muted">Venue management and booking list arrive in Phase F5.</p>
      </section>
    </PageShell>
  );
}

export default OwnerDashboardRoute;
