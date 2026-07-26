import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "@/redux/slices/AuthSlice";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/Roles";

const VendorNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { profile } = useSelector(
    (state) => state.vendorProfile
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "--";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(
        logout({
          role: ROLES.VENDOR,
        })
      ).unwrap();

      toast.success(
        "Vendor logged out successfully"
      );

      navigate(ROUTES.PUBLIC.LOGIN);
    } catch (error) {
      toast.error(
        error?.message ||
          "Logout failed. Please try again."
      );
    }
  };

  return (
    <header className="h-20 px-8 bg-white border-b flex items-center justify-between">

      {/* Search Bar */}
      <div className="relative w-[420px]">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <Input
          placeholder="Search venues, bookings..."
          className="pl-10 bg-slate-50 border-slate-200"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button
          className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
        >
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile Dropdown */}
        <div
          ref={dropdownRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setIsDropdownOpen(
                (previous) => !previous
              )
            }
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition"
          >

            {/* Profile Image */}
            {profile?.profileImage?.url ? (
              <img
                src={profile.profileImage.url}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 text-white flex items-center justify-center font-semibold">
                {initials}
              </div>
            )}

            {/* User Details */}
            <div className="text-left">
              <p className="font-semibold text-sm text-slate-900">
                {user?.name || "Vendor"}
              </p>

              <p className="text-xs text-slate-500">
                Venue Owner
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform ${
                isDropdownOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-14 z-50 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

              {/* Profile */}
              <button
                type="button"
                onClick={() => {
                  navigate(
                    ROUTES.VENDOR.PROFILE
                  );

                  setIsDropdownOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <User size={18} />

                <span>
                  My Profile
                </span>
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => {
                  navigate(
                    ROUTES.VENDOR.SETTINGS
                  );

                  setIsDropdownOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings size={18} />

                <span>
                  Settings
                </span>
              </button>

              <div className="border-t border-slate-100" />

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />

                <span>
                  Logout
                </span>
              </button>

            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default VendorNavbar;