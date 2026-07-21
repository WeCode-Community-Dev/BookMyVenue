import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchBookingDetailAsync,
  cancelBookingAsync,
} from "../modules/bookings/bookingSlice";

const STATUS_STYLES = {
  pending_payment: "bg-amber-50 text-amber-700",
  booked: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500",
};

function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading && !current) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] p-6">
        <p className="text-rose-600">{error}</p>
        <Link to="/order-history" className="text-sm text-blue-600 mt-2 inline-block">
          Back to order history
        </Link>
      </div>
    );
  }
  if (!current) return null;

  const badgeCls = STATUS_STYLES[current.status] || "bg-slate-100 text-slate-600";
  const canCancel = current.status !== "cancelled";
  const canPay = current.status === "pending_payment";

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="mx-auto max-w-xl px-4 py-6">
        <Link to="/order-history" className="text-sm text-blue-600 hover:underline">
          ← Order history
        </Link>

        <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {current.venue_name || `Venue #${current.venue_id}`}
              </h1>
              {current.venue_location && (
                <p className="text-sm text-slate-400">{current.venue_location}</p>
              )}
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeCls}`}>
              {current.status?.replace("_", " ")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Row label="Order ID" value={`#${current.id}`} />
            <Row label="Amount" value={`₹${Number(current.amount).toLocaleString("en-IN")}`} />
            <Row label="Date" value={current.booking_date} />
            <Row label="Time" value={String(current.time_slot).slice(0, 5)} />
            {current.payment_status && (
              <Row label="Payment" value={current.payment_status} />
            )}
            {current.payment?.paid_at && (
              <Row
                label="Paid at"
                value={new Date(current.payment.paid_at).toLocaleString("en-IN")}
              />
            )}
          </div>

          {current.notes && (
            <div className="text-sm bg-slate-50 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-1">Notes</p>
              <p className="text-slate-700">{current.notes}</p>
            </div>
          )}

          {current.cancellation_reason && (
            <div className="text-sm bg-rose-50 rounded-xl p-3">
              <p className="text-rose-400 text-xs mb-1">Cancellation reason</p>
              <p className="text-rose-700">{current.cancellation_reason}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {canPay && (
              <button
                onClick={() => navigate(`/checkout/${current.id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                Complete payment
              </button>
            )}
            {canCancel && current.status !== "cancelled" && (
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 border border-rose-200 text-rose-600 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-50"
              >
                Cancel order
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Cancel order</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Reason for cancellation (optional)"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 py-2.5 rounded-xl text-sm hover:bg-slate-50"
              >
                Keep order
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"
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
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

export default BookingDetailPage;
