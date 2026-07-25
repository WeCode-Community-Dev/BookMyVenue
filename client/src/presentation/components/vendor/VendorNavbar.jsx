import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";

const VendorNavbar = () => {
  const { profile } = useSelector((state) => state.vendorProfile);
  const { user } = useSelector((state) => state.auth)

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "--";

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
        <button className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition">

          {profile?.profileImage?.url ? (
            <img
              src={profile.profileImage.url}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white flex items-center justify-center font-semibold">
              {initials}
            </div>
          )}

          <div>
            <p className="font-semibold text-sm text-slate-900">
              {user?.name || "Vendor"}
            </p>

            <p className="text-xs text-slate-500">
              Venue Owner
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-slate-500"
          />

        </div>

      </div>

    </header>
  );
};

export default VendorNavbar;