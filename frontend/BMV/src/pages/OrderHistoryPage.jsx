import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookingsAsync } from "../modules/bookings/bookingSlice";

const STATUS_STYLES = {
  pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
  booked: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

const FILTERS = [
  { key: "", label: "All" },
  { key: "booked", label: "Confirmed" },
  { key: "pending_payment", label: "Pending payment" },
  { key: "cancelled", label: "Cancelled" },
];

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

function formatTime(t) {
  if (!t) return "";
  return String(t).slice(0, 5);
}

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
    <div className="min-h-screen bg-[#f0f2f5]">
      <header className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-xs text-blue-600 hover:underline">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Order History</h1>
            <p className="text-sm text-slate-400">
              {user?.name ? `${user.name}'s bookings` : "Your past and upcoming orders"}
            </p>
          </div>
          {pagination && (
            <span className="text-sm text-slate-400">{pagination.total_items} orders</span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl">{error}</p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-500 text-sm">No orders found.</p>
            <Link to="/dashboard" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Browse venues
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {bookings.map((b) => (
            <Link
              key={b.id}
              to={`/bookings/${b.id}`}
              className="block bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:border-blue-100 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {b.venue_name || `Venue #${b.venue_id}`}
                  </p>
                  {b.venue_location && (
                    <p className="text-sm text-slate-400 truncate">{b.venue_location}</p>
                  )}
                  <p className="text-sm text-slate-600 mt-2">
                    {b.booking_date} · {formatTime(b.time_slot)}
                  </p>
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
                    <p className="text-xs text-slate-400 capitalize">
                      Payment: {b.payment_status}
                    </p>
                  )}
                  {b.status === "pending_payment" && (
                    <span className="inline-block text-xs text-blue-600 font-medium">
                      Pay now →
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default OrderHistoryPage;
