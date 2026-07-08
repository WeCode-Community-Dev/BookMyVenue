import React from "react";
import { NavLink } from "react-router-dom";
import SidebarProfileCard from "./SidebarProfileCard";
import { ROUTES } from "@/constants/routes";


import {
  LayoutDashboard,
  Building2,
  PlusSquare,
  CalendarDays,
  User,
  Settings,
  LogOut,
  MapPin,
} from "lucide-react";

const VendorSidebar = () => {
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

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6 flex flex-col">

      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <MapPin size={20} />
        </div>

        <div>
          <h1 className="font-bold text-lg">
            BookMyVenue
          </h1>

          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Vendor Portal
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <SidebarProfileCard />

      {/* Menu Label */}
      <p className="text-xs uppercase text-gray-400 tracking-wider mt-6 mb-3">
        Main Menu
      </p>

      {/* Navigation */}
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium"
                    : "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-slate-800 hover:text-white transition"
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <div className="mt-auto pt-8 border-t border-slate-800">
        <button className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition">
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default VendorSidebar;