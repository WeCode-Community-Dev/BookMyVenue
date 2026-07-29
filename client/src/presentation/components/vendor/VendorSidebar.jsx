import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  LayoutDashboard,
  Building2,
  PlusSquare,
  CalendarDays,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import SidebarProfileCard from "./SidebarProfileCard";

import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/Roles";
import { logout } from "@/redux/slices/AuthSlice";

import logo from "@/assets/images/logo.jpeg";

const VendorSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: ROUTES.VENDOR.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      name: "My Venues",
      path: ROUTES.VENDOR.VENUES,
      icon: Building2,
    },
    {
      name: "Add Venue",
      path: ROUTES.VENDOR.ADD_VENUE,
      icon: PlusSquare,
    },
    {
      name: "Bookings",
      path: ROUTES.VENDOR.BOOKINGS,
      icon: CalendarDays,
    },
    {
      name: "Profile",
      path: ROUTES.VENDOR.PROFILE,
      icon: User,
    },
    {
      name: "Settings",
      path: ROUTES.VENDOR.SETTINGS,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(
        logout({
          role: ROLES.VENDOR,
        })
      ).unwrap();

      toast.success("Vendor logged out successfully");

      navigate(ROUTES.PUBLIC.LOGIN);
    } catch (error) {
      toast.error(
        error?.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <aside className="w-70 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Book My Venue"
            className="h-18 w-20 object-contain"
          />

          <div>
            <h1 className="text-lg font-bold">
              BookMyVenue
            </h1>

            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Vendor Portal
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 pt-4">
        <SidebarProfileCard />
      </div>

      {/* Menu Label */}
      <p className="px-6 mt-6 mb-3 text-xs uppercase text-gray-400 tracking-wider">
        Main Menu
      </p>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-amber-600 text-white font-medium transition-all"
                  : "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-all"
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-amber-600 hover:text-white transition-all"
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default VendorSidebar;