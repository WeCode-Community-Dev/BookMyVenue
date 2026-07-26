import { ROUTES } from "@/constants/routes";
import { CalendarDays, Heart, Key, MapPin, Settings, User  } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const UserSidebar = () => {
  const menuItems = [
    {
      name: "Explore Venues",
      path: ROUTES.USER.BROWSE_VENUES,
      icon: MapPin ,
    },
    {
      name: "Profile",
      path: ROUTES.USER.PROFILE,
      icon: User,
    },
    {
      name: "Wishlist",
      path: ROUTES.USER.WISHLIST,
      icon: Heart,
    },
    {
      name: "Bookings",
      path: ROUTES.USER.BOOKINGS,
      icon: CalendarDays,
    },
    {
      name: "Change Password",
      path: ROUTES.USER.CHANGE_PASSWORD,
      icon: Key,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6 flex flex-col">
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
                    ? "flex items-center gap-3 px-4 py-3 rounded-xl text-amber-600 font-medium"
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
    </aside>
  );
};

export default UserSidebar;
