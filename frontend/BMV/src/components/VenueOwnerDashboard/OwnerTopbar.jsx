import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { logoutUserAsync } from "../../modules/auth/authSlice";
import { useState, useEffect, useRef } from "react";
import NotificationsPanel from "./NotificationsPanel";
import { useOwnerLayout } from "./OwnerLayout";

const PAGE_TITLES = {
  "/owner/dashboard": { title: "Dashboard", subtitle: "Here's what's happening with your venues today." },
  "/owner/venues": { title: "My Venues", subtitle: "Manage your venue listings" },
  "/owner/bookings": { title: "Bookings", subtitle: "View and manage all bookings" },
  "/owner/check-in": { title: "Check-in scan", subtitle: "Scan guest QR codes to accommodate arrivals" },
  "/owner/reviews": { title: "Reviews", subtitle: "Customer feedback on your venues" },
  "/owner/revenue": { title: "Revenue", subtitle: "Track payments across your venues" },
  "/owner/enquiries": { title: "Enquiries", subtitle: "Notifications and booking requests" },
  "/owner/messages": { title: "Messages", subtitle: "Customer conversations" },
  "/owner/settings": { title: "Settings", subtitle: "Account and preferences" },
};

function getPageMeta(pathname) {
  if (pathname.startsWith("/owner/venues/") && pathname.endsWith("/manage")) {
    return { title: "Manage Venue", subtitle: "Bookings and venue details" };
  }
  if (pathname.startsWith("/owner/venues/") && pathname.endsWith("/edit")) {
    return { title: "Edit Venue", subtitle: "Update venue information" };
  }
  return PAGE_TITLES[pathname] || { title: "Owner Portal", subtitle: "Manage your venues" };
}

function OwnerTopbar() {
  const { user } = useSelector((state) => state.auth);
  const { notifications, loading } = useSelector((state) => state.venueOwner);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { setMobileNavOpen } = useOwnerLayout();

  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const panelRef = useRef(null);
  const bellRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const firstName = user?.name?.split(" ")[0] || "Owner";
  const pageMeta = getPageMeta(location.pathname);

  const handleBellClick = () => {
    setPanelOpen((v) => !v);
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-600 shrink-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {location.pathname === "/owner/dashboard"
              ? `Welcome back, ${firstName}!`
              : pageMeta.title}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{pageMeta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <div className="relative">
          <button
            ref={bellRef}
            type="button"
            onClick={handleBellClick}
            className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className={panelOpen ? "text-rose-700" : "text-gray-500"} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
            )}
          </button>

          {panelOpen && (
            <div
              ref={panelRef}
              className="absolute right-0 mt-2 w-80 z-50 shadow-xl rounded-2xl border border-gray-100 overflow-hidden bg-white"
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Notifications {unreadCount > 0 && `· ${unreadCount} new`}
                </span>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  <X size={14} />
                </button>
              </div>
              <NotificationsPanel
                notifications={notifications}
                loading={loading.notifications}
                compact
                viewAllTo="/owner/enquiries"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v);
              setPanelOpen(false);
            }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center text-sm font-semibold">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.name || "Owner"}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">Owner</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 text-sm z-20">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/owner/settings");
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default OwnerTopbar;
