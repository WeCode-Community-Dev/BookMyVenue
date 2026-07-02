import { CalendarCheck, ThumbsUp, Wallet } from "lucide-react";

const TYPE_CONFIG = {
  booking_request: { icon: CalendarCheck, bg: "bg-rose-50", color: "text-rose-700" },
  review: { icon: ThumbsUp, bg: "bg-blue-50", color: "text-blue-600" },
  payment: { icon: Wallet, bg: "bg-emerald-50", color: "text-emerald-600" },
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function NotificationsPanel({ notifications, loading }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-rose-900">Notifications</h3>
        <button className="text-xs font-medium text-rose-700 hover:underline">View all</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3.5">
          {notifications.map((n) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.booking_request;
            const Icon = config.icon;
            return (
              <div key={n.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                  <Icon size={14} className={config.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-emerald-700 leading-tight">
                    {n.message}
                  </p>
                  {n.venue_name && (
                    <p className="text-xs text-gray-400 mt-0.5">{n.venue_name}</p>
                  )}
                  {n.booking_ref && (
                    <p className="text-xs text-gray-400 mt-0.5">Booking ID: {n.booking_ref}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotificationsPanel;
