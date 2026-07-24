import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchBookingDetailAsync,
  cancelBookingAsync,
} from "../modules/bookings/bookingSlice";
import StatusBadge from "../components/shared/StatusBadge";
import BookingQrCode from "../components/BookingQrCode";
import ReviewForm from "../components/ReviewForm";
import { formatBookingPeriod } from "../utils/bookingFormat";
import { formatPolicyDate } from "../utils/cancellationPolicy";

const PAYMENT_OPTION_LABELS = {
  full: "Paid in full",
  advance: "Advance paid",
  pay_at_venue: "Pay at venue",
};

function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((state) => state.bookings);

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchBookingDetailAsync(Number(id)));
  }, [dispatch, id]);

  const awaitingOwnerApproval =
    current?.status === "booked" && current?.owner_status === "pending";

  useEffect(() => {
    if (!awaitingOwnerApproval) return undefined;
    const interval = setInterval(() => {
      dispatch(fetchBookingDetailAsync(Number(id)));
    }, 10000);
    return () => clearInterval(interval);
  }, [awaitingOwnerApproval, dispatch, id]);

  const handleCancel = async () => {
    setCancelling(true);
    const result = await dispatch(
      cancelBookingAsync({ id: Number(id), reason }),
    );
    setCancelling(false);
    if (cancelBookingAsync.fulfilled.match(result)) {
      setShowModal(false);
      setReason("");
    }
  };

  if (loading && !current) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-rose-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error && !current) {
    return (
      <div className="max-w-xl">
        <p className="text-rose-600">{error}</p>
        <Link to="/order-history" className="text-sm text-rose-800 mt-2 inline-block hover:underline">
          Back to bookings
        </Link>
      </div>
    );
  }
  if (!current) return null;

  const canCancel =
    current.can_cancel ??
    (current.status !== "cancelled" && current.status !== "completed");
  const policy = current.cancellation_policy;
  const refundPreviewPercent = current.refund_percent_if_cancelled ?? 0;
  const refundPreviewAmount = current.refund_amount_if_cancelled ?? 0;
  const canPay = current.status === "pending_payment";
  const awaitingPaymentForQr =
    current.owner_status === "accepted" && current.status === "pending_payment";
  const awaitingOwnerApprovalForQr =
    current.status === "booked" && current.owner_status === "pending";

  return (
    <div className="max-w-xl space-y-4">
      <Link to="/order-history" className="text-sm text-rose-800 hover:underline">
        ← My bookings
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {current.venue_name || `Venue #${current.venue_id}`}
            </h1>
            {current.venue_location && (
              <p className="text-sm text-slate-400">{current.venue_location}</p>
            )}
          </div>
          <StatusBadge status={current.status} />
        </div>
        {current.owner_status === "pending" && current.status === "booked" && (
          <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            Owner approval pending — your check-in QR will appear here once the venue owner accepts.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Order ID" value={`#${current.id}`} />
          <Row label="Amount" value={`₹${Number(current.amount).toLocaleString("en-IN")}`} />
          <Row label="Period" value={formatBookingPeriod(current)} className="col-span-2" />
          {current.num_days > 1 && <Row label="Duration" value={`${current.num_days} days`} />}
          {current.payment_status && <Row label="Payment" value={current.payment_status} />}
          {current.payment_option && (
            <Row label="Payment plan" value={PAYMENT_OPTION_LABELS[current.payment_option] ?? current.payment_option} />
          )}
          {Number(current.amount_paid) > 0 && (
            <Row label="Paid" value={`₹${Number(current.amount_paid).toLocaleString("en-IN")}`} />
          )}
          {current.status !== "cancelled" && Number(current.balance_due) > 0 && (
            <Row label="Balance due" value={`₹${Number(current.balance_due).toLocaleString("en-IN")}`} />
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

        {current.status === "cancelled" && (
          <div className="text-sm bg-emerald-50 border border-emerald-100 rounded-xl p-3 space-y-1">
            <p className="text-emerald-800 text-xs font-medium">Refund status</p>
            {current.refund_status && (current.refund_amount_if_cancelled ?? 0) > 0 ? (
              <>
                <p className="text-emerald-700">
                  {(current.refund_percent_if_cancelled ?? 0)}% refund of ₹
                  {Number(current.refund_amount_if_cancelled).toLocaleString("en-IN")}
                </p>
                <p className="text-emerald-600 text-xs capitalize">
                  Status: {String(current.refund_status).replace(/_/g, " ")}
                </p>
              </>
            ) : (
              <p className="text-slate-600">
                No refund was issued for this cancellation.
              </p>
            )}
          </div>
        )}

        {policy && current.status !== "cancelled" && (
          <div className="text-sm bg-slate-50 rounded-xl p-3 space-y-2">
            <p className="text-slate-500 text-xs font-medium">Cancellation policy</p>
            <ul className="text-slate-700 space-y-1 text-xs">
              <li>100% refund if cancelled on or before {formatPolicyDate(policy.refund_50_deadline)}</li>
              <li>50% refund if cancelled on or before {formatPolicyDate(policy.refund_25_deadline)}</li>
              <li>25% refund if cancelled on or before {formatPolicyDate(policy.last_cancel_date)}</li>
            </ul>
            {!canCancel && (
              <p className="text-rose-600 text-xs pt-1">
                The last day to cancel this booking has passed.
              </p>
            )}
            {canCancel && refundPreviewPercent > 0 && (
              <p className="text-emerald-700 text-xs pt-1">
                If you cancel now: {refundPreviewPercent}% refund (₹{Number(refundPreviewAmount).toLocaleString("en-IN")})
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {canPay && (
            <button
              type="button"
              onClick={() => navigate(`/checkout/${current.id}`)}
              className="flex-1 bg-rose-900 hover:bg-rose-950 text-white py-2.5 rounded-xl text-sm font-medium"
            >
              Complete payment
            </button>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex-1 border border-rose-200 text-rose-600 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-50"
            >
              Cancel order
            </button>
          )}
        </div>
      </div>

      {current.show_check_in_qr && current.check_in_token && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Venue check-in QR</h2>
          {current.checked_in_at ? (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3">
              Checked in at {new Date(current.checked_in_at).toLocaleString("en-IN")}
            </p>
          ) : (
            <BookingQrCode token={current.check_in_token} />
          )}
        </div>
      )}

      {awaitingOwnerApprovalForQr && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900 space-y-1">
          <p className="font-semibold">Payment received — waiting for venue approval</p>
          <p className="text-blue-800">
            The venue owner must accept your booking before your check-in QR code is generated.
            This page will update automatically once approved.
          </p>
        </div>
      )}

      {awaitingPaymentForQr && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          Your booking is approved. Complete payment to unlock your check-in QR code.
        </div>
      )}

      {current.can_review && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Rate your experience</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              How was your event at {current.venue_name || "this venue"}?
            </p>
          </div>
          <ReviewForm
            venueId={current.venue_id}
            bookingId={current.id}
            googleMapsUrl={current.google_maps_url}
            onSuccess={() => dispatch(fetchBookingDetailAsync(Number(id)))}
          />
        </div>
      )}

      {current.has_review && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-800">
          You have already reviewed this booking. Thank you for your feedback!
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Cancel order</h2>
            {refundPreviewPercent > 0 ? (
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                Estimated refund: <span className="font-semibold">{refundPreviewPercent}%</span>
                {" "}(₹{Number(refundPreviewAmount).toLocaleString("en-IN")})
              </p>
            ) : current.status === "booked" ? (
              <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                No refund applies for cancellation at this time.
              </p>
            ) : (
              <p className="text-sm text-slate-500 bg-slate-50 rounded-xl px-3 py-2">
                Payment has not been completed — no refund will be processed.
              </p>
            )}
            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 rounded-xl px-3 py-2">{error}</p>
            )}
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              placeholder="Reason for cancellation (optional)"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 py-2.5 rounded-xl text-sm hover:bg-slate-50"
              >
                Keep order
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, className = "" }) {
  return (
    <div className={`bg-slate-50 rounded-xl p-3 ${className}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

export default BookingDetailPage;
