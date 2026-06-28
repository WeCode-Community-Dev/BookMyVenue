import { useEffect, useMemo, useState } from "react";
import { getProviderBookings } from "../../services/bookingService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import BookingSummary from "../../components/bookings/BookingSummary";
import BookingFiltersBar from "../../components/bookings/BookingFiltersBar";
import ProviderBookingRow, {
  ProviderBookingTableHeader,
} from "../../components/provider/bookings/ProviderBookingRow";
import {
  filterProviderBookings,
  getBookingStats,
} from "../../utils/providerBookingFilters";

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProviderBookings();

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

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [bookings]
  );

  const stats = useMemo(
    () => getBookingStats(sortedBookings),
    [sortedBookings]
  );

  const filteredBookings = useMemo(
    () =>
      filterProviderBookings(sortedBookings, {
        statusFilter: activeFilter,
        searchQuery,
      }),
    [sortedBookings, activeFilter, searchQuery]
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[1.65rem]">
          Provider Bookings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          All reservations on your venues — tap Call when a customer has added
          their mobile number.
        </p>
      </div>

      {loading && <Loader label="Loading bookings..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchBookings} />
      )}

      {!loading && !error && bookings.length === 0 && (
        <EmptyState
          title="No bookings for your venues"
          description="When customers book your venues, their reservations will appear here."
        />
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-4">
          <BookingSummary stats={stats} />

          <BookingFiltersBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search customer, venue, or reference"
          />

          {filteredBookings.length === 0 ? (
            <EmptyState
              title="No matching bookings"
              description="Try a different filter or search term."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white ring-1 ring-gray-100/80">
              <ProviderBookingTableHeader />
              <div className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <ProviderBookingRow
                    key={booking._id || booking.bookingReference}
                    booking={booking}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProviderBookings;
