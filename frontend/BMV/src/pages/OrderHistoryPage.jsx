import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookingsAsync } from "../modules/bookings/bookingSlice";
import StatusBadge from "../components/shared/StatusBadge";
import EmptyState from "../components/shared/EmptyState";
import { formatBookingPeriod } from "../utils/bookingFormat";

const FILTERS = [
  { key: "", label: "All" },
  { key: "booked", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "pending_payment", label: "Pending payment" },
  { key: "cancelled", label: "Cancelled" },
];

function OrderHistoryPage() {
  const dispatch = useDispatch();
  const { list, pagination, loading, error } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchMyBookingsAsync({ status: filter }));
  }, [dispatch, filter]);

  const bookings = Array.isArray(list) ? list : [];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Bookings</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {user?.name ? `${user.name}'s orders` : "Your past and upcoming orders"}
          </p>
        </div>
        {pagination && (
          <span className="text-sm text-slate-400 shrink-0">{pagination.total_items} orders</span>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-rose-900 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            title="No orders found"
            description="Try a different filter or browse venues to book."
            actionLabel="Browse venues"
            actionTo="/venues"
          />
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((b) => (
          <Link
            key={b.id}
            to={`/bookings/${b.id}`}
            className="block bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:border-rose-200 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {b.venue_name || `Venue #${b.venue_id}`}
                </p>
                {b.venue_location && (
                  <p className="text-sm text-slate-400 truncate">{b.venue_location}</p>
                )}
                <p className="text-sm text-slate-600 mt-2">{formatBookingPeriod(b)}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Order #{b.id} · {new Date(b.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="text-right shrink-0 space-y-2">
                <StatusBadge status={b.status} />
                <p className="text-base font-bold text-slate-800">
                  ₹{Number(b.amount).toLocaleString("en-IN")}
                </p>
                {b.payment_status && (
                  <p className="text-xs text-slate-400 capitalize">Payment: {b.payment_status}</p>
                )}
                {b.status === "pending_payment" && (
                  <span className="inline-block text-xs text-rose-800 font-medium">Pay now →</span>
                )}
                {b.can_review && (
                  <span className="inline-block text-xs text-rose-800 font-medium">Write review →</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OrderHistoryPage;
