import { useState } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

const VendorNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { profile } = useSelector(
    (state) => state.vendorProfile
  );

  return (
    <header className="h-20 bg-white border-b border-gray-400 flex items-center justify-end px-6 shadow-sm">

      <div className="relative">

        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >

          {/* Profile Image */}
          {profile?.profileImage?.url ? (
            <img
              src={profile.profileImage.url}
              alt={profile.fullName || "Vendor"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User size={25} />
          )}

          {/* Name */}
          <span className="font-medium">
            {profile?.fullName || "Vendor User"}
          </span>

          <ChevronDown size={25} />

        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">

            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600"
            >
              <LogOut size={18} />

              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
};

export default VendorNavbar;