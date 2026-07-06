import { useSelector, useDispatch } from "react-redux";
import { Bell, ChevronDown, X } from "lucide-react";
import { logoutUserAsync } from "../../modules/auth/authSlice";
import { fetchNotificationsAsync } from "../../modules/venueOwner/venueOwnerSlice";
import { useState, useEffect, useRef } from "react";
import NotificationsPanel from "./NotificationsPanel";

function OwnerTopbar() {
  const { user } = useSelector((state) => state.auth);
  const { notifications, loading } = useSelector((state) => state.venueOwner);
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const panelRef = useRef(null);
  const bellRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const firstName = user?.name?.split(" ")[0] || "Owner";

  // Fetch notifications when panel is opened (if not already loaded)
  const handleBellClick = () => {
    if (!panelOpen && notifications.length === 0) {
      dispatch(fetchNotificationsAsync());
    }
    setPanelOpen((v) => !v);
    setMenuOpen(false); // close user menu if open
  };

  // Close panel on outside click
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

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Here&apos;s what&apos;s happening with your venues today.
        </p>
      </div>

      <div className="flex items-center gap-5">
        {/* Bell icon with notification dropdown */}
        <div className="relative">
          <button
            ref={bellRef}
            onClick={handleBellClick}
            className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell
              size={20}
              className={panelOpen ? "text-rose-700" : "text-gray-500"}
            />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
            )}
          </button>

          {/* Notifications dropdown panel */}
          {panelOpen && (
            <div
              ref={panelRef}
              className="absolute right-0 mt-2 w-80 z-50 shadow-xl rounded-2xl border border-gray-100 overflow-hidden"
            >
              {/* Panel header with close button */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Notifications {unreadCount > 0 && `· ${unreadCount} new`}
                </span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  <X size={14} />
                </button>
              </div>
              <NotificationsPanel
                notifications={notifications}
                loading={loading.notifications}
              />
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setMenuOpen((v) => !v); setPanelOpen(false); }}
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
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 text-sm">
              <button
                onClick={() => dispatch(logoutUserAsync())}
                className="w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 rounded-lg"
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