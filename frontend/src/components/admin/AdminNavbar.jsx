import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Clock3,
  Settings2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/authContext.js";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/home",
  },
  {
    label: "Venue Approvals",
    icon: Clock3,
    path: "/admin/venues/pending",
  },
  {
    label: "Venue Options",
    icon: Settings2,
    path: "/admin/venue-options",
  },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  return (
    <aside className="fixed flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="border-b border-gray-200 px-5 py-4">
        <Link
          to="/admin/home"
          className="flex items-center gap-2"
        >
          <img
            src="/favicon.png"
            alt="logo"
            className="h-8 w-8"
          />
          <span className="font-semibold text-gray-900">
            BookMyVenue • Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="p-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
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

      {/* Logout */}
      <div className="mt-auto border-t border-gray-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}