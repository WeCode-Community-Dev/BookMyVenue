import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarCheck, ThumbsUp, Wallet } from "lucide-react";
import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import EmptyState from "../components/shared/EmptyState";
import { fetchNotificationsAsync } from "../modules/venueOwner/venueOwnerSlice";

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

function OwnerEnquiriesPage() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.venueOwner);

  useEffect(() => {
    dispatch(fetchNotificationsAsync());
  }, [dispatch]);

  return (
    <OwnerLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Enquiries & Notifications</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Booking requests, reviews, and payment updates
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          {loading.notifications ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState
              title="You're all caught up"
              description="New booking requests and reviews will appear here."
            />
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.booking_request;
                const Icon = config.icon;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}
                    >
                      <Icon size={16} className={config.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800">{n.message}</p>
                      {n.venue_name && (
                        <p className="text-xs text-gray-400 mt-0.5">{n.venue_name}</p>
                      )}
                      {n.booking_ref && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Booking ID: {n.booking_ref}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 mt-2 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}

export default OwnerEnquiriesPage;
