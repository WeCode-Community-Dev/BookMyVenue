import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CalendarCheck, CreditCard, IndianRupee, MapPin } from "lucide-react";
import { fetchMyBookingsAsync } from "../modules/bookings/bookingSlice";
import StatusBadge from "../components/shared/StatusBadge";
import EmptyState from "../components/shared/EmptyState";
import { formatBookingPeriod } from "../utils/bookingFormat";

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        <Icon size={16} />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { list: bookings, loading: bookingsLoading, error: bookingsError } = useSelector(
    (state) => state.bookings,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyBookingsAsync({ limit: 20 }));
  }, [dispatch]);

  const bookingList = Array.isArray(bookings) ? bookings : [];

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = bookingList.filter((b) => {
      if (b.status === "cancelled") return false;
      const end = b.check_out_date || b.booking_date;
      return end && new Date(end) >= today;
    });

    const pendingPayment = bookingList.filter((b) => b.status === "pending_payment");
    const totalSpent = bookingList
      .filter((b) => b.status === "booked")
      .reduce((sum, b) => sum + Number(b.amount || 0), 0);

    return {
      upcoming: upcoming.length,
      pendingPayment: pendingPayment.length,
      total: bookingList.length,
      totalSpent,
      recent: bookingList.slice(0, 5),
      firstPending: pendingPayment[0],
    };
  }, [bookingList]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {user?.name ? `Hello, ${user.name.split(" ")[0]}` : "Your dashboard"}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage bookings and explore venues</p>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} label="Upcoming" value={stats.upcoming} />
        <StatCard icon={CreditCard} label="Pending pay" value={stats.pendingPayment} />
        <StatCard icon={MapPin} label="Total bookings" value={stats.total} />
        <StatCard
          icon={IndianRupee}
          label="Total spent"
          value={`₹${stats.totalSpent.toLocaleString("en-IN")}`}
        />
      </section>

      {stats.firstPending && (
        <Link
          to={`/bookings/${stats.firstPending.id}`}
          className="block bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100/80 transition-colors"
        >
          <p className="text-sm font-semibold text-amber-800">Payment pending</p>
          <p className="text-sm text-amber-700 mt-1">
            Complete payment for {stats.firstPending.venue_name || "your booking"} — ₹
            {Number(stats.firstPending.amount).toLocaleString("en-IN")}
          </p>
          <span className="inline-block text-xs font-medium text-amber-800 mt-2">
            Pay now →
          </span>
        </Link>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-800">Recent bookings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your latest orders</p>
            </div>
            <Link to="/order-history" className="text-xs font-medium text-rose-800 hover:underline">
              View all
            </Link>
          </div>

          {bookingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : bookingsError ? (
            <p className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl">{bookingsError}</p>
          ) : stats.recent.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              description="Browse venues and book your first event."
              actionLabel="Browse venues"
              actionTo="/venues"
            />
          ) : (
            <div className="space-y-3">
              {stats.recent.map((b) => (
                <Link
                  key={b.id}
                  to={`/bookings/${b.id}`}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-rose-200 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {b.venue_name || `Venue #${b.venue_id}`}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{formatBookingPeriod(b)}</p>
                    <p className="text-xs text-slate-400 mt-1">Order #{b.id}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1.5">
                    <StatusBadge status={b.status} />
                    <p className="text-sm font-bold text-slate-800">
                      ₹{Number(b.amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            to="/profile"
            className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-rose-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wide">Profile</p>
            <p className="font-semibold text-slate-800 mt-1">{user?.name || "Your account"}</p>
            <p className="text-sm text-slate-400 mt-1 truncate">{user?.email}</p>
            <p className="text-xs text-rose-800 mt-3 font-medium">View & edit →</p>
          </Link>

          <Link
            to="/venues"
            className="block bg-white rounded-2xl border border-slate-100 p-5 hover:border-rose-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wide">Explore</p>
            <p className="font-semibold text-slate-800 mt-1">Browse venues</p>
            <p className="text-sm text-slate-400 mt-1">Find and book your next venue</p>
            <p className="text-xs text-rose-800 mt-3 font-medium">Search venues →</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
