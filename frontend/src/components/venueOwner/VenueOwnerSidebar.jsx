import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Building2, CalendarDays, ChartColumn, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/authContext.js";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/venue-owner/dashboard",
  },
  {
    label: "My Venues",
    icon: Building2,
    path: "/venue-owner/my-venues",
  },
  {
    label: "Bookings",
    icon: CalendarDays,
    path: "/venue-owner/bookings",
  },
  {
    label: "Analytics",
    icon: ChartColumn,
    path: "/venue-owner/analytics",
  },
];
export default function VenueOwnerSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white fixed">
      <div className="border-b border-gray-200 px-5 py-4">
        <Link
          to="/venue-owner/dashboard"
          className="flex items-center gap-2"
        >
          <img
            src="/favicon.png"
            alt="logo"
            className="h-8 w-8"
          />
          <span className="font-semibold text-gray-900">
            BookMyVenue • Venue Owner
          </span>
        </Link>
      </div>

      <div className="p-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-3 border-t border-gray-200">
        <NavLink
          to="/venue-owner/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}