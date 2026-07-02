import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Building2,
  CalendarCheck,
  MessageCircleQuestion,
  Wallet,
  Star,
  Mail,
  Settings,
  HelpCircle,
  Store,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, to: "/owner/dashboard" },
  { label: "My Venues", icon: Building2, to: "/owner/venues" },
  { label: "Bookings", icon: CalendarCheck, to: "/owner/bookings", badge: 12 },
  { label: "Enquiries", icon: MessageCircleQuestion, to: "/owner/enquiries", badge: 8 },
  { label: "Revenue", icon: Wallet, to: "/owner/revenue" },
  { label: "Reviews", icon: Star, to: "/owner/reviews" },
  { label: "Messages", icon: Mail, to: "/owner/messages" },
  { label: "Settings", icon: Settings, to: "/owner/settings" },
];

function OwnerSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="w-9 h-9 rounded-lg bg-rose-900 flex items-center justify-center shrink-0">
          <Store size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-gray-900">BookMyVenue</p>
          <p className="text-[10px] font-medium text-gray-400 tracking-wide">
            VENUE OWNER
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, to, badge }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-rose-50 text-rose-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? "text-rose-900" : "text-gray-400"}
                  />
                  {label}
                </span>
                {badge ? (
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? "bg-rose-900 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <HelpCircle size={18} className="text-gray-400" />
          Support &amp; Help
        </button>
      </div>
    </aside>
  );
}

export default OwnerSidebar;
