import { Menu, Bell, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useUIStore } from '@/store/ui.store';
import { useAppStore } from '@/store/app.store';

interface DashboardNavbarProps {
  title: string;
  subtitle: string;
  profileLink: string;
  bellColor: string;
  userLabel: string;
}

const DashboardNavbar = ({
  title,
  subtitle,
  profileLink,
  bellColor,
  userLabel,
}: DashboardNavbarProps) => {
  const user = useAppStore((state) => state.user);
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Panel */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-background lg:hidden text-foreground cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="text-muted text-xs">{subtitle}</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            className="relative rounded-xl p-2 text-muted transition hover:bg-background hover:text-foreground cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className={`absolute top-1 right-1 h-2 w-2 rounded-full ${bellColor}`} />
          </button>

          <Link
            to={profileLink}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 hover:border-primary transition-all duration-200"
          >
            <UserCircle size={28} className="text-primary" />
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-foreground">{user?.fullName || userLabel}</p>
              <p className="text-muted text-xs capitalize">{user?.role || 'user'}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
