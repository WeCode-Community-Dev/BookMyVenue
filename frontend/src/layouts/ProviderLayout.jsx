import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  CalendarCheck,
  Menu,
  X,
  LogOut,
  Store,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ProviderBrand from "../components/provider/ProviderBrand";

const navItems = [
  {
    id: "dashboard",
    to: "/provider/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "venues",
    to: "/provider/venues",
    label: "My Venues",
    icon: Building2,
  },
  {
    id: "create-venue",
    to: "/provider/venues/new",
    label: "Create Venue",
    icon: PlusCircle,
  },
  {
    id: "bookings",
    to: "/provider/bookings",
    label: "Bookings",
    icon: CalendarCheck,
  },
];

const isNavItemActive = (id, pathname) => {
  switch (id) {
    case "dashboard":
      return pathname === "/provider/dashboard";
    case "venues":
      return (
        pathname === "/provider/venues" ||
        (pathname.startsWith("/provider/venues/") &&
          pathname !== "/provider/venues/new")
      );
    case "create-venue":
      return pathname === "/provider/venues/new";
    case "bookings":
      return (
        pathname === "/provider/bookings" ||
        pathname.startsWith("/provider/bookings/")
      );
    default:
      return false;
  }
};

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? "border-l-[3px] border-red-800 bg-red-50/90 pl-[9px] text-red-900"
      : "border-l-[3px] border-transparent pl-[9px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  }`;

const ProviderLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    closeSidebar();
    await logout();
    navigate("/");
  };

  const sidebarContent = (
    <>
      <div className="hidden shrink-0 border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5 lg:block">
        <ProviderBrand onClick={closeSidebar} />
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ id, to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={navLinkClass}
            onClick={closeSidebar}
            isActive={() => isNavItemActive(id, location.pathname)}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {isAuthenticated && user && (
        <div className="shrink-0 space-y-3 border-t border-gray-100 bg-white px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.name || "User"}
            </p>
            <p className="truncate text-xs text-gray-500">{user.email || ""}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={closeSidebar}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <Store className="h-4 w-4 shrink-0" aria-hidden="true" />
              Back to marketplace
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/50 px-3 text-sm font-semibold text-red-800 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-dvh overflow-x-clip bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <ProviderBrand compact />

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
            aria-label="Open provider menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeSidebar}
          aria-label="Close provider menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,16rem)] flex-col border-r border-gray-100 bg-white shadow-xl transition-transform duration-200 sm:w-64 lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold text-gray-900">Menu</span>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">{sidebarContent}</div>
      </aside>

      <div className="lg:pl-64">
        <main className="min-h-dvh">
          <div className="hidden border-b border-gray-100 bg-white px-4 py-4 sm:px-6 lg:block lg:px-8">
            <p className="text-sm text-gray-500">Provider workspace</p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-gray-900">
              Manage your venues and bookings
            </h1>
          </div>

          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
