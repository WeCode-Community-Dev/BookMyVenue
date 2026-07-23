import { Navigate } from 'react-router-dom';
import { PageShell } from '@/app/layout/page-shell';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { VenueList } from '@/features/venues/components/venue-list';

export function LandingRoute() {
  const { role } = useAuth();

  // Owners manage venues — they don't browse/book like customers.
  if (role === 'OWNER') {
    return <Navigate to={paths.owner.dashboard.path} replace />;
  }

  return (
    <PageShell>
      <VenueList />
    </PageShell>
  );
}

export default LandingRoute;
