import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchBookingDetailAsync,
  cancelBookingAsync,
} from "../modules/bookings/bookingSlice";

const STATUS_BADGE = {
  pending_payment: "bg-amber-100 text-amber-800",
  booked: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function BookingDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((state) => state.bookings);

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchBookingDetailAsync(Number(id)));
  }, [dispatch, id]);

  const handleCancel = async () => {
    const result = await dispatch(
      cancelBookingAsync({ id: Number(id), reason }),
    );
    if (cancelBookingAsync.fulfilled.match(result)) {
      setShowModal(false);
      setReason("");
    }
  };

  if (loading && !current) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!current) return null;

  const badgeCls = STATUS_BADGE[current.status] || "bg-gray-100 text-gray-800";
  const canCancel = current.status !== "cancelled";

  return (
    <div className="mx-auto max-w-xl p-6">
      <Link to="/my-bookings" className="text-sm text-blue-600">
        &larr; Back to my bookings
      </Link>

      <div className="mt-4 space-y-3 rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Booking #{current.id}</h1>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${badgeCls}`}>
            {current.status}
          </span>
        </div>

        <Row label="Venue" value={`#${current.venue_id}`} />
        <Row label="Date" value={current.booking_date} />
        <Row label="Time slot" value={current.time_slot} />
        <Row label="Amount" value={`₹ ${current.amount}`} />
        {current.payment_status && (
          <Row label="Payment" value={current.payment_status} />
        )}
        {current.notes && <Row label="Notes" value={current.notes} />}
        {current.cancellation_reason && (
          <Row label="Cancellation reason" value={current.cancellation_reason} />
        )}

        {canCancel && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Cancel booking
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm space-y-4 rounded-lg bg-white p-5">
            <h2 className="text-lg font-semibold">Cancel booking</h2>
            <p className="text-sm text-gray-600">
              Please tell us why you are cancelling.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="Reason for cancellation"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Keep booking
              </button>
              <button
                onClick={handleCancel}
                disabled={!reason.trim()}
                className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default BookingDetailPage;
