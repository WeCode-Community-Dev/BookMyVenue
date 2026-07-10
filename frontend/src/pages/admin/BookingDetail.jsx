import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdminBookingById } from "../../services/adminService";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminDetailRow from "../../components/admin/AdminDetailRow";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/profile/StatusBadge";
import { resolvePopulatedRef } from "../../utils/booking";
import { formatPrice } from "../../utils/formatPrice";
import {
  formatSlotDate,
  formatSlotLabel,
  formatTimeRange,
} from "../../utils/formatDate";
import { formatStatusLabel } from "../../utils/adminFormat";

const AdminBookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminBookingById(id);

      if (data.success) {
        setBooking(data.data);
      } else {
        setBooking(null);
        setError(data.message || "Booking not found.");
      }
    } catch (err) {
      setBooking(null);
      setError(
        err.response?.data?.message ||
          "Unable to load booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const customer = resolvePopulatedRef(booking?.userId);
  const venue = resolvePopulatedRef(booking?.venueId);
  const slot = resolvePopulatedRef(booking?.availabilityId);
  const { amount } = formatPrice(booking?.amount);

  return (
    <>
      <div className="mb-4">
        <Link
          to="/admin/bookings"
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          ← Back to bookings
        </Link>
      </div>

      {loading && <Loader label="Loading booking..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchBooking} />
      )}

      {!loading && !error && booking && (
        <>
          <AdminPageHeader
            title={booking.bookingReference || "Booking"}
            description={`Booked on ${formatSlotDate(booking.bookedAt || booking.createdAt)}`}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
              <h2 className="text-base font-semibold text-gray-900">Booking</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <AdminDetailRow align="start" label="Amount" value={amount} />
                <AdminDetailRow align="start"
                  label="Booking status"
                  value={
                    <StatusBadge
                      label={formatStatusLabel(booking.bookingStatus)}
                      tone={
                        booking.bookingStatus === "confirmed"
                          ? "success"
                          : "neutral"
                      }
                    />
                  }
                />
                <AdminDetailRow align="start"
                  label="Payment status"
                  value={
                    <StatusBadge
                      label={formatStatusLabel(booking.paymentStatus)}
                      tone={
                        booking.paymentStatus === "paid" ? "success" : "warning"
                      }
                    />
                  }
                />
                <AdminDetailRow align="start"
                  label="Payment method"
                  value={booking.paymentMethod || "—"}
                />
                <AdminDetailRow align="start"
                  label="Payment ID"
                  value={booking.paymentId || "—"}
                />
                <AdminDetailRow align="start"
                  label="Razorpay order"
                  value={booking.razorpayOrderId || "—"}
                />
                <AdminDetailRow align="start"
                  label="Contact phone"
                  value={booking.contactPhone || "—"}
                />
              </dl>
            </section>

            <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
              <h2 className="text-base font-semibold text-gray-900">Customer</h2>
              {customer ? (
                <dl className="mt-4 space-y-3 text-sm">
                  <AdminDetailRow align="start" label="Name" value={customer.name} />
                  <AdminDetailRow align="start" label="Email" value={customer.email} />
                  <AdminDetailRow align="start" label="Phone" value={customer.phone || "—"} />
                </dl>
              ) : (
                <p className="mt-4 text-sm text-gray-500">—</p>
              )}
              {customer?._id && (
                <Link
                  to={`/admin/users/${customer._id}`}
                  className="mt-4 inline-flex text-sm font-medium text-red-600 hover:text-red-700"
                >
                  View customer →
                </Link>
              )}
            </section>

            <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
              <h2 className="text-base font-semibold text-gray-900">Venue</h2>
              {venue ? (
                <>
                  <dl className="mt-4 space-y-3 text-sm">
                    <AdminDetailRow align="start" label="Title" value={venue.title} />
                    <AdminDetailRow align="start"
                      label="Location"
                      value={
                        [venue.city, venue.state].filter(Boolean).join(", ") ||
                        "—"
                      }
                    />
                  </dl>
                  <Link
                    to={`/admin/venues/${venue._id}`}
                    className="mt-4 inline-flex text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    View venue →
                  </Link>
                </>
              ) : (
                <p className="mt-4 text-sm text-gray-500">—</p>
              )}
            </section>

            <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
              <h2 className="text-base font-semibold text-gray-900">Slot</h2>
              {slot ? (
                <dl className="mt-4 space-y-3 text-sm">
                  <AdminDetailRow align="start"
                    label="Date"
                    value={formatSlotDate(slot.date)}
                  />
                  <AdminDetailRow align="start"
                    label="Slot"
                    value={formatSlotLabel(slot.slotLabel)}
                  />
                  <AdminDetailRow align="start"
                    label="Time"
                    value={formatTimeRange(slot.startTime, slot.endTime)}
                  />
                </dl>
              ) : (
                <p className="mt-4 text-sm text-gray-500">—</p>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default AdminBookingDetail;
