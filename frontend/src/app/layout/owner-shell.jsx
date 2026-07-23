import { NavLink } from 'react-router-dom';

import { Header } from '@/app/layout/header';
import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';

const OWNER_NAV = [
  { label: 'Dashboard', to: paths.owner.dashboard.path, end: true },
  { label: 'Bookings', to: paths.owner.listOrders.path },
  { label: 'Add venue', to: paths.owner.venueNew.path },
];

function OwnerNavLink({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'block rounded-md px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-brand-surface text-brand-text' : 'text-brand-muted hover:bg-brand-surface/70 hover:text-brand-text',
        )
      }
    >
      {children}
    </NavLink>
  );
}

export function OwnerShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto flex max-w-page flex-col gap-6 px-6 py-8 md:flex-row md:items-start">
        <aside className="w-full shrink-0 md:sticky md:top-24 md:w-56">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-muted">Owner</p>
          <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible" aria-label="Owner navigation">
            {OWNER_NAV.map((item) => (
              <OwnerNavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </OwnerNavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
