import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Building2, CalendarCheck, IndianRupee, UserCog, CheckCircle2, ArrowRight, } from "lucide-react";
import { getDashboardStats, getRecentActivity, } from "../../services/adminService";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatCard from "../../components/admin/AdminStatCard";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { formatPrice } from "../../utils/formatPrice";
import { formatSlotDateCompact } from "../../utils/formatDate";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [revenueVisible, setRevenueVisible] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      setActivityError("");

      const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
      ]);

      if (statsData.success) {
        setStats(statsData.data);
      } else {
        setError(statsData.message || "Failed to load dashboard stats.");
        return;
      }

      if (activityData.success) {
        setActivity(activityData.data);
      } else {
        setActivity(null);
        setActivityError(
          activityData.message || "Could not load recent activity."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const revenueDisplay = stats
    ? formatPrice(stats.totalRevenue).amount
    : "—";

  return (
    <>
      <AdminPageHeader
        title="Admin Dashboard"
        description="Platform overview and recent activity."
      />

      {loading && <Loader label="Loading dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchDashboard} />
      )}

      {!loading && !error && stats && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
            <AdminStatCard
              label="Marketplace users"
              value={stats.totalUsers}
              icon={Users}
              iconClass="bg-sky-50 text-sky-600"
            />
            <AdminStatCard
              label="Total providers"
              value={stats.totalProviders}
              icon={UserCog}
              iconClass="bg-violet-50 text-violet-600"
            />
            <AdminStatCard
              label="Total venues"
              value={stats.totalVenues}
              icon={Building2}
              iconClass="bg-red-50 text-red-600"
            />
            <AdminStatCard
              label="Active venues"
              value={stats.activeVenues}
              icon={CheckCircle2}
              iconClass="bg-emerald-50 text-emerald-600"
            />
            <AdminStatCard
              label="Confirmed paid bookings"
              value={stats.confirmedPaidBookings}
              icon={CalendarCheck}
              iconClass="bg-amber-50 text-amber-600"
            />
            <AdminStatCard
              label="Total revenue"
              value={revenueDisplay}
              maskedValue="₹••••••"
              isValueVisible={revenueVisible}
              onToggleVisibility={() => setRevenueVisible((visible) => !visible)}
              icon={IndianRupee}
              iconClass="bg-emerald-50 text-emerald-600"
            />
          </div>

          {activityError && (
            <p
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
              role="status"
            >
              {activityError}
            </p>
          )}

          {activity && (
            <div className="grid gap-5 lg:grid-cols-3">
              <RecentSection
                title="Recent users"
                linkTo="/admin/users"
                items={activity.users}
                renderItem={(user) => (
                  <Link
                    to={`/admin/users/${user._id}`}
                    className="block rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                  >
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </Link>
                )}
                emptyMessage="No marketplace users yet."
              />

              <RecentSection
                title="Recent venues"
                linkTo="/admin/venues"
                items={activity.venues}
                renderItem={(venue) => (
                  <Link
                    to={`/admin/venues/${venue._id}`}
                    className="block rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                  >
                    <p className="truncate text-sm font-medium text-gray-900">
                      {venue.title}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {venue.city || "—"}
                    </p>
                  </Link>
                )}
                emptyMessage="No venues yet."
              />

              <RecentSection
                title="Recent bookings"
                linkTo="/admin/bookings"
                items={activity.bookings}
                renderItem={(booking) => (
                  <Link
                    to={`/admin/bookings/${booking._id}`}
                    className="block rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                  >
                    <p className="truncate text-sm font-medium text-gray-900">
                      {booking.bookingReference || booking._id}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {booking.venueId?.title || "Venue"} ·{" "}
                      {formatSlotDateCompact(booking.createdAt)}
                    </p>
                  </Link>
                )}
                emptyMessage="No bookings yet."
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const RecentSection = ({
  title,
  linkTo,
  items = [],
  renderItem,
  emptyMessage,
}) => (
  <section className="overflow-hidden rounded-xl border border-gray-200/80 bg-white ring-1 ring-gray-100/80">
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <Link
        to={linkTo}
        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
      >
        View all
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
    <ul className="divide-y divide-gray-100 p-2">
      {items.length === 0 ? (
        <li className="px-3 py-6 text-center text-sm text-gray-500">
          {emptyMessage}
        </li>
      ) : (
        items.map((item) => (
          <li key={item._id}>{renderItem(item)}</li>
        ))
      )}
    </ul>
  </section>
);

export default AdminDashboard;
