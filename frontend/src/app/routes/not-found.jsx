import { Link } from 'react-router-dom';

import { PageShell } from '@/app/layout/page-shell';
import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';

export function NotFoundRoute() {
  return (
    <PageShell>
      <div className="py-20 text-center">
        <h1 className="text-3xl font-semibold text-brand-text">Page not found</h1>
        <p className="mt-2 text-brand-muted">The page you are looking for does not exist.</p>
        <Link to={paths.home.path} className="mt-6 inline-block">
          <Button>Go home</Button>
        </Link>
      </div>
    </PageShell>
  );
}

export default NotFoundRoute;
