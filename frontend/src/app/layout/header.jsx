import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { logout } from '@/features/auth/stores/auth-slice';

export function Header() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useAuth();

  function handleLogout() {
    dispatch(logout());
    toast.success('Logged out');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-white">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-6">
        <Link to={paths.home.path} className="text-xl font-semibold text-brand-text">
          Book My Venue
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {role === 'CUSTOMER' ? (
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link to={paths.bookings.mine.path}>My bookings</Link>
                </Button>
              ) : null}
              {role === 'OWNER' ? (
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link to={paths.owner.dashboard.path}>Dashboard</Link>
                </Button>
              ) : null}
              <span className="hidden text-sm text-brand-muted sm:inline">{user?.username}</span>
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to={paths.auth.login.path}>Log in</Link>
              </Button>
              <Button asChild>
                <Link to={paths.auth.register.path}>Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
