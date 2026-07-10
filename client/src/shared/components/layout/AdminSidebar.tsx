import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  User,
  LogOut,
  X,
  Boxes,
  Banknote,
  CreditCard,
} from 'lucide-react';
import { useUIStore } from '@/store/ui.store';
import { useLogout } from '@/features/auth/hooks/useLogout';

const adminNavLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Users', href: '/admin/users', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: Boxes },
  { name: 'Manage Venues', href: '/admin/venues', icon: Building2 },
  { name: 'Settlements', href: '/admin/settlements', icon: Banknote },
  { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
  { name: 'Bookings Overview', href: '/admin/bookings', icon: CalendarDays },
  { name: 'Profile Settings', href: '/admin/profile', icon: User },
];

export default function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const handleLogout = useLogout();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 lg:z-30 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand/Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <svg
              className="h-8 w-8 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 9v8l10 5 10-5V9l-10 6z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-foreground">BookMyVenue</span>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-muted hover:bg-background hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links Area */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary pl-3'
                      : 'text-muted hover:bg-background hover:text-foreground border-l-4 border-transparent'
                  }
                `}
              >
                <Icon
                  size={20}
                  className="transition-transform group-hover:scale-110 duration-200"
                />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User/Logout Footer */}
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="
              group flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-error hover:bg-error/10 transition-colors duration-200
            "
          >
            <LogOut
              size={20}
              className="transition-transform group-hover:translate-x-0.5 duration-200"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
