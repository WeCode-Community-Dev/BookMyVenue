import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  IndianRupee,
  PlusCircle,
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { getMyVenues } from "../../services/venueService";
import { getProviderBookings } from "../../services/bookingService";
import { getBookingStats } from "../../utils/providerBookingFilters";
import { formatPrice } from "../../utils/formatPrice";
import ProviderBookingRow, {
  ProviderBookingTableHeader,
} from "../../components/provider/bookings/ProviderBookingRow";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const isConfirmedPaidBooking = (booking) =>
  booking?.bookingStatus === "confirmed" && booking?.paymentStatus === "paid";

const getConfirmedPaidRevenueStats = (bookings = []) => {
  let confirmedBookings = 0;
  let totalRevenue = 0;

  bookings.forEach((booking) => {
    if (!isConfirmedPaidBooking(booking)) return;

    confirmedBookings += 1;

    const amount = Number(booking.amount);
    if (Number.isFinite(amount) && amount > 0) {
      totalRevenue += amount;
    }
  });

  return { confirmedBookings, totalRevenue };
};

const statConfig = [
  {
    key: "totalVenues",
    label: "Total venues",
    icon: Building2,
    iconClass: "bg-red-50 text-red-600",
  },
  {
    key: "activeVenues",
    label: "Active venues",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "totalBookings",
    label: "Total bookings",
    icon: CalendarCheck,
    iconClass: "bg-sky-50 text-sky-600",
  },
  {
    key: "confirmedBookings",
    label: "Confirmed bookings",
    icon: BadgeCheck,
    iconClass: "bg-violet-50 text-violet-600",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    icon: CalendarClock,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    key: "revenueCollected",
    label: "Revenue collected",
    icon: IndianRupee,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
];

const DashboardStatGrid = ({
  stats,
  revenueVisible = false,
  onToggleRevenueVisibility,
}) => (
  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
    {statConfig.map(({ key, label, icon: Icon, iconClass }) => {
      const isRevenue = key === "revenueCollected";
      const displayValue =
        isRevenue && !revenueVisible ? "₹••••••" : (stats[key] ?? 0);

      return (
        <div
          key={key}
          className="rounded-lg border border-gray-200/80 bg-white px-3 py-2.5 ring-1 ring-gray-100/80 sm:px-4 sm:py-3"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${iconClass}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-lg font-bold tabular-nums leading-none text-gray-900 sm:text-xl">
                  {displayValue}
                </p>
                {isRevenue && onToggleRevenueVisibility && (
                  <button
                    type="button"
                    onClick={onToggleRevenueVisibility}
                    className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label={revenueVisible ? "Hide revenue" : "Show revenue"}
                  >
                    {revenueVisible ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
              <p className="mt-0.5 truncate text-[11px] font-medium text-gray-500 sm:text-xs">
                {label}
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const quickActions = [
  {
    to: "/provider/venues/new",
    label: "Create venue",
    icon: PlusCircle,
    primary: true,
  },
  {
    to: "/provider/venues",
    label: "My venues",
    icon: Building2,
    primary: false,
  },
  {
    to: "/provider/bookings",
    label: "All bookings",
    icon: CalendarCheck,
    primary: false,
  },
];

const QuickActions = () => (
  <div className="flex flex-wrap gap-2">
    {quickActions.map(({ to, label, icon: Icon, primary }) => (
      <Link
        key={to}
        to={to}
        className={
          primary
            ? "inline-flex min-h-9 items-center gap-2 rounded-lg bg-red-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            : "inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        }
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {label}
      </Link>
    ))}
  </div>
);

const ProviderDashboard = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingsError, setBookingsError] = useState("");
  const [revenueVisible, setRevenueVisible] = useState(false);

  const fetchBookingsOnly = async () => {
    try {
      setBookingsError("");

      const bookingsData = await getProviderBookings();

      if (bookingsData.success) {
        setBookings(bookingsData.data ?? []);
      } else {
        setBookings([]);
        setBookingsError(
          bookingsData.message || "Failed to load bookings."
        );
      }
    } catch (err) {
      setBookings([]);
      setBookingsError(
        err.response?.data?.message ||
        "Unable to load bookings. Please try again."
      );
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      setBookingsError("");

      const [venuesData, bookingsData] = await Promise.all([
        getMyVenues(),
        getProviderBookings(),
      ]);

      if (venuesData.success) {
        setVenues(venuesData.data ?? []);
      } else {
        setVenues([]);
        setError(venuesData.message || "Failed to load venues.");
        return;
      }

      if (bookingsData.success) {
        setBookings(bookingsData.data ?? []);
      } else {
        setBookings([]);
        setBookingsError(
          bookingsData.message || "Failed to load bookings."
        );
      }
    } catch (err) {
      setVenues([]);
      setBookings([]);
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const bookingStats = useMemo(() => getBookingStats(bookings), [bookings]);

  const revenueStats = useMemo(
    () => getConfirmedPaidRevenueStats(bookings),
    [bookings]
  );

  const dashboardStats = useMemo(
    () => ({
      totalVenues: venues.length,
      activeVenues: venues.filter((v) => v.isActive === true).length,
      totalBookings: bookingStats.total,
      confirmedBookings: revenueStats.confirmedBookings,
      upcoming: bookingStats.upcoming,
      revenueCollected: formatPrice(revenueStats.totalRevenue).amount,
    }),
    [venues, bookingStats, revenueStats]
  );

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [bookings]
  );

  const hasVenues = venues.length > 0;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[1.65rem]">
          Provider Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your venues and incoming bookings.
        </p>
      </div>

      {loading && <Loader label="Loading dashboard..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchDashboardData} />
      )}

      {!loading && !error && !hasVenues && (
        <>
          <EmptyState
            title="No venues created yet"
            description="Create your first venue to start receiving bookings."
          />

          <div className="mt-5">
            <Link
              to="/provider/venues/new"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Create your first venue
            </Link>
          </div>
        </>
      )}

      {!loading && !error && hasVenues && (
        <div className="space-y-5">
          <DashboardStatGrid
            stats={dashboardStats}
            revenueVisible={revenueVisible}
            onToggleRevenueVisibility={() =>
              setRevenueVisible((visible) => !visible)
            }
          />

          <QuickActions />

          {bookingsError && (
            <ErrorState message={bookingsError} onRetry={fetchBookingsOnly} />
          )}

          <section className="overflow-hidden rounded-xl border border-gray-200/80 bg-white ring-1 ring-gray-100/80">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-3 sm:px-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Recent bookings
                </h2>
                <p className="text-xs text-gray-500">
                  Latest reservations across your venues
                </p>
              </div>

              <Link
                to="/provider/bookings"
                className="inline-flex items-center gap-1 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {!bookingsError && recentBookings.length === 0 && (
              <div className="px-4 py-8">
                <EmptyState
                  title="No bookings yet"
                  description="When customers book your venues, they will show up here."
                />
              </div>
            )}

            {!bookingsError && recentBookings.length > 0 && (
              <>
                <ProviderBookingTableHeader />
                <div className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <ProviderBookingRow
                      key={booking._id || booking.bookingReference}
                      booking={booking}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default ProviderDashboard;
