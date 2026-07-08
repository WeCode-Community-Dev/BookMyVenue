import { PageShell } from '@/app/layout/page-shell';
import { VenueList } from '@/features/venues/components/venue-list';

export function LandingRoute() {
  return (
    <PageShell>
      <VenueList />
    </PageShell>
  );
}

export default LandingRoute;
