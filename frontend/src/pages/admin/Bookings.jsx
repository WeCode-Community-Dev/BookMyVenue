import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminBookings } from "../../services/adminService";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminFilterSelect from "../../components/admin/AdminFilterSelect";
import AdminTable from "../../components/admin/AdminTable";
import AdminPagination from "../../components/admin/AdminPagination";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/profile/StatusBadge";
import { resolvePopulatedRef } from "../../utils/booking";
import { formatPrice } from "../../utils/formatPrice";
import {
  formatSlotDateCompact,
  formatSlotLabel,
} from "../../utils/formatDate";
import { formatStatusLabel } from "../../utils/adminFormat";

const BOOKING_STATUS_OPTIONS = [
  { value: "", label: "All booking statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All payment statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminBookings({
        page,
        limit,
        bookingStatus,
        paymentStatus,
      });

      if (data.success) {
        setBookings(data.data ?? []);
        setCount(data.count ?? 0);
      } else {
        setBookings([]);
        setCount(0);
        setError(data.message || "Failed to load bookings.");
      }
    } catch (err) {
      setBookings([]);
      setCount(0);
      setError(
        err.response?.data?.message ||
          "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, bookingStatus, paymentStatus]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <>
      <AdminPageHeader
        title="Bookings"
        description="View all platform bookings."
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <AdminFilterSelect
          label="Booking status"
          value={bookingStatus}
          onChange={(value) => {
            setBookingStatus(value);
            setPage(1);
          }}
          options={BOOKING_STATUS_OPTIONS}
        />
        <AdminFilterSelect
          label="Payment status"
          value={paymentStatus}
          onChange={(value) => {
            setPaymentStatus(value);
            setPage(1);
          }}
          options={PAYMENT_STATUS_OPTIONS}
        />
      </div>

      {loading && <Loader label="Loading bookings..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchBookings} />
      )}

      {!loading && !error && bookings.length === 0 && (
        <EmptyState
          title="No bookings found"
          description="Try adjusting your filters."
        />
      )}

      {!loading && !error && bookings.length > 0 && (
        <AdminTable>
          <div className="divide-y divide-gray-100">
            {bookings.map((booking) => {
              const customer = resolvePopulatedRef(booking.userId);
              const venue = resolvePopulatedRef(booking.venueId);
              const slot = resolvePopulatedRef(booking.availabilityId);
              const { amount } = formatPrice(booking.amount);

              return (
                <div
                  key={booking._id}
                  className="flex flex-col gap-3 px-4 py-3 lg:grid lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-center lg:gap-3"
                >
                  <div>
                    <Link
                      to={`/admin/bookings/${booking._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-red-600"
                    >
                      {booking.bookingReference || booking._id}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {customer?.name || "Customer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {venue?.title || "Venue"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot
                        ? `${formatSlotDateCompact(slot.date)} · ${formatSlotLabel(slot.slotLabel)}`
                        : "—"}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{amount}</p>
                  <StatusBadge
                    label={formatStatusLabel(booking.bookingStatus)}
                    tone={
                      booking.bookingStatus === "confirmed"
                        ? "success"
                        : "neutral"
                    }
                  />
                  <StatusBadge
                    label={formatStatusLabel(booking.paymentStatus)}
                    tone={
                      booking.paymentStatus === "paid" ? "success" : "warning"
                    }
                  />
                </div>
              );
            })}
          </div>

          <AdminPagination
            page={page}
            limit={limit}
            count={count}
            onPageChange={setPage}
          />
        </AdminTable>
      )}
    </>
  );
};

export default AdminBookings;
