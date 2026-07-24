import { useEffect, useMemo, useState } from "react";
import { getMyBookings } from "../../services/bookingService";
import BookingCard from "../../components/common/BookingCard";
import BookingSummary from "../../components/bookings/BookingSummary";
import BookingFiltersBar from "../../components/bookings/BookingFiltersBar";
import BookingsEmptyState from "../../components/bookings/BookingsEmptyState";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { filterBookings, getBookingStats, CUSTOMER_BOOKING_FILTERS, } from "../../utils/bookingFilters";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyBookings();

      if (data.success) {
        setBookings(Array.isArray(data.data) ? data.data : []);
      } else {
        setBookings([]);
        setError(data.message || "Failed to load bookings.");
      }
    } catch (err) {
      setBookings([]);
      setError(
        err.response?.data?.message ||
        "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [bookings]);

  const stats = useMemo(() => getBookingStats(sortedBookings), [sortedBookings]);

  const filteredBookings = useMemo(
    () =>
      filterBookings(sortedBookings, {
        statusFilter: activeFilter,
        searchQuery,
      }),
    [sortedBookings, activeFilter, searchQuery]
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
          View your venue reservations.
        </p>
      </div>

      {loading && <Loader label="Loading bookings..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchBookings} />
      )}

      {!loading && !error && bookings.length === 0 && <BookingsEmptyState />}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-5 sm:space-y-6">
          <BookingSummary stats={stats} hideCancelled />

          <BookingFiltersBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={CUSTOMER_BOOKING_FILTERS}
          />

          {filteredBookings.length === 0 ? (
            <EmptyState
              title="No matching bookings"
              description="Try a different filter or search term to find your reservations."
            />
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id || booking.bookingReference}
                  booking={booking}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default MyBookings;
