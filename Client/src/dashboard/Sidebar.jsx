import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Mail,
  Users,
  ChevronLast,
  ChevronFirst,
  LogOut,
  University,
  UserPen,
  NotepadText,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useAuth from "../Auth/useAuth";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  onCloseMobile,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";

  const menuItem = useMemo(() => {
    if (isAdmin) {
      return [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard",
        },
        {
          id: "NewVenues",
          label: "New venues",
          icon: Mail,
          badge: 3,
          path: "/dashboard/new-venues",
        },
        {
          id: "Venues",
          label: "Venues",
          icon: University,
          path: "/dashboard/venues",
        },
        { id: "Users", label: "Users", icon: Users, path: "/dashboard/users" },
        {
          id: "Organizers",
          label: "Organizers",
          icon: UserPen,
          path: "/dashboard/organizers",
        },
      ];
    }

    if (isOrganizer) {
      return [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard",
        },
        {
          id: "venues",
          label: "Venues",
          icon: University,
          path: "/dashboard/venues",
        },
        {
          id: "bookings",
          label: "Bookings",
          icon: NotepadText,
          path: "bookings",
        },
        {
          id: "users",
          label: "Users",
          icon: Users,
          path: "/dashboard/users",
        },
      ];
    }

    return [];
  }, [isAdmin, isOrganizer]);

  const handleItemClick = (path) => {
    navigate(path);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`flex flex-col bg-[#F7F5EE] border-r border-slate-200 transition-all duration-300 h-full ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/50 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-10 h-10 bg-[#FAF9F6] rounded-xl flex items-center justify-center border border-slate-200 
          shadow-sm p-1 flex-shrink-0"
          >
            <img
              src={logo}
              alt=""
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span class="text-ticket-orange font-bold text-xl">TS</span>';
              }}
            />
          </div>
          {sidebarOpen && (
            <span className="text-slate-900 text-xl font-bold tracking-tight whitespace-nowrap animate-fade-in">
              Book My Venue
            </span>
          )}
        </Link>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden xl:flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100
           text-slate-500 hover:text-slate-800 border border-slate-200 transition-all"
        >
          {sidebarOpen ? (
            <ChevronFirst className="w-4 h-4" />
          ) : (
            <ChevronLast className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar ">
        {menuItem?.map((item, idx) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard" ||
                location.pathname === "/dashboard/"
              : location.pathname.startsWith(item.path);

          const delays = [
            "delay-0",
            "delay-75",
            "delay-150",
            "delay-225",
            "delay-300",
            "delay-375",
            "delay-450",
            "delay-525",
          ];
          const delayClass = delays[idx % delays.length];

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 relative group
                 font-medium animate-fade-in-up ${delayClass} ${
                   isActive
                     ? "bg-ticket-yellow/20 text-slate-900 shadow-sm border-l-4 border-ticket-yellow"
                     : "text-slate-500 hover:bg-white/50 hover:text-slate-800 border-l-4 border-transparent"
                 }`}
              style={{
                animationDelay: `0.${(idx || 0) + 1}s`,
              }}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform 
                  group-hover:scale-105 ${isActive ? "text-ticket-orange" : "text-slate-400"}`}
              />

              {sidebarOpen && (
                <span className="text-sm font-semibold tracking-wide flex-1 text-left whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {!sidebarOpen && (
                <span
                  className="absolute left-20 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs 
                font-bold px-3 py-2 rounded-xl transition-all duration-200 z-50 shadow-md whitespace-nowrap"
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 bg-ticket-yellow text-slate-900 font-extrabold px-1 rounded-md text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </span>
              )}

              {sidebarOpen && item.badge && (
                <span
                  className="bg-ticket-yellow text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full 
                shadow-sm animate-pulse"
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/50 relative flex-shrink-0">
        {profileOpen && sidebarOpen && (
          <div
            className="absolute bottom-20 left-4 right-4 bg-[#F7F5EE] border border-slate-200 p-3 rounded-2xl 
            shadow-xl space-y-1 z-50 animate-fade-in-up"
            style={{ animationDuration: "0.2s" }}
          >
            <div className="px-2 py-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
              Account
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl flex
               items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        )}

        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className={`w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-white/50 transition-colors
             text-left border ${profileOpen ? "border-ticket-yellow bg-white/30" : "border-transparent"}`}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border border-slate-300/60 shadow-sm flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">
                {user?.userName || "Admin User"}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-ticket-orange"></span>{" "}
                {user?.role || "Admin"}
              </div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
