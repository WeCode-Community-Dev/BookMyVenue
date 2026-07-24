import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutGrid,
  Building2,
  CalendarCheck,
  ScanLine,
  MessageCircleQuestion,
  Wallet,
  Star,
  Mail,
  Settings,
  HelpCircle,
  Store,
  LayoutDashboard,
  X,
} from "lucide-react";
import { useOwnerLayout } from "./OwnerLayout";

const CUSTOMER_DASHBOARD_ROUTE = "/dashboard";

function SidebarNav({ onNavigate }) {
  const navigate = useNavigate();
  const { summary, notifications } = useSelector((state) => state.venueOwner);

  const pendingBookings = summary?.booking_requests_pending ?? 0;
  const unreadNotifications = notifications.filter((n) => !n.is_read).length;

  const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutGrid, to: "/owner/dashboard" },
    { label: "My Venues", icon: Building2, to: "/owner/venues" },
    {
      label: "Bookings",
      icon: CalendarCheck,
      to: "/owner/bookings",
      badge: pendingBookings || null,
    },
    { label: "Check-in scan", icon: ScanLine, to: "/owner/check-in" },
    {
      label: "Enquiries",
      icon: MessageCircleQuestion,
      to: "/owner/enquiries",
      badge: unreadNotifications || null,
    },
    { label: "Revenue", icon: Wallet, to: "/owner/revenue" },
    { label: "Reviews", icon: Star, to: "/owner/reviews" },
    { label: "Messages", icon: Mail, to: "/owner/messages" },
    { label: "Settings", icon: Settings, to: "/owner/settings" },
  ];

  const handleNav = () => {
    onNavigate?.();
  };

  return (
    <>
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="w-9 h-9 rounded-lg bg-rose-900 flex items-center justify-center shrink-0">
          <Store size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-gray-900">BookMyVenue</p>
          <p className="text-[10px] font-medium text-gray-400 tracking-wide">VENUE OWNER</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, to, badge }) => (
          <NavLink
            key={label}
            to={to}
            onClick={handleNav}
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
                  <Icon size={18} className={isActive ? "text-rose-900" : "text-gray-400"} />
                  {label}
                </span>
                {badge ? (
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                      isActive ? "bg-rose-900 text-white" : "bg-gray-100 text-gray-500"
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

      <div className="px-3 pb-6 space-y-1">
        <button
          type="button"
          onClick={() => {
            navigate(CUSTOMER_DASHBOARD_ROUTE);
            handleNav();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 transition-colors"
        >
          <LayoutDashboard size={18} className="text-rose-700 shrink-0" />
          Switch to Customer View
        </button>

        <a
          href="mailto:support@bookmyvenue.com"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <HelpCircle size={18} className="text-gray-400 shrink-0" />
          Support &amp; Help
        </a>
      </div>
    </>
  );
}

function OwnerSidebar() {
  const { mobileNavOpen, setMobileNavOpen } = useOwnerLayout();

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100">
        <SidebarNav />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white shadow-xl">
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

export default OwnerSidebar;
