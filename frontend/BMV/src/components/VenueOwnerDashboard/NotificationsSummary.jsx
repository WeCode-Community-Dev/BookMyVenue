import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

function NotificationsSummary({ notifications, loading }) {
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
          <Bell size={18} className="text-rose-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-rose-900">Notifications</h3>
          {loading ? (
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-xs text-gray-400 mt-0.5">
              {unread > 0
                ? `${unread} unread · ${notifications.length} total`
                : notifications.length > 0
                  ? `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`
                  : "No new notifications"}
            </p>
          )}
        </div>
      </div>
      <Link
        to="/owner/enquiries"
        className="block mt-4 w-full py-2.5 rounded-xl border border-rose-200 text-rose-800 text-sm font-semibold hover:bg-rose-50 transition-colors text-center"
      >
        {unread > 0 ? `View ${unread} unread` : "View all notifications"}
      </Link>
    </div>
  );
}

export default NotificationsSummary;
