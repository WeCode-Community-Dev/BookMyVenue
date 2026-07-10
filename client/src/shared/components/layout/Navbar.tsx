import { useLocation } from 'react-router-dom';
import { DashboardNavbar, UserNavbar } from '@/shared/components/ui';
import { useAppStore } from '@/store/app.store';

const Navbar = () => {
  const { pathname } = useLocation();
  const user = useAppStore((state) => state.user);

  // Determine layout type based on route prefix and user role
  const isOwnerRoute = pathname.startsWith('/owner') && user?.role === 'owner';
  const isAdminRoute = pathname.startsWith('/admin') && user?.role === 'admin';

  if (isOwnerRoute) {
    return (
      <DashboardNavbar
        title="Venue Manager Dashboard"
        subtitle="Manage venues, bookings, and revenue"
        profileLink="/owner/profile"
        bellColor="bg-accent"
        userLabel="Venue Owner"
      />
    );
  }

  if (isAdminRoute) {
    return (
      <DashboardNavbar
        title="Admin Dashboard"
        subtitle="Manage platform operations"
        profileLink="/admin/profile"
        bellColor="bg-error"
        userLabel="Admin"
      />
    );
  }

  return <UserNavbar />;
};

export default Navbar;
