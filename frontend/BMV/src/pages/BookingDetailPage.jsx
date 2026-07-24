import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchBookingDetailAsync,
  cancelBookingAsync,
} from "../modules/bookings/bookingSlice";

// ─── Status helpers ───────────────────────────────────────────────────────────

// The payment lifecycle status shown to customers
const PAYMENT_STATUS_STYLES = {
  pending_payment: { label: "Awaiting payment", classes: "bg-amber-50 text-amber-700 border border-amber-100" },
  booked:          { label: "Booked",           classes: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
  cancelled:       { label: "Cancelled",         classes: "bg-slate-100 text-slate-500 border border-slate-200" },
};

// The owner's decision status
const OWNER_STATUS_CONFIG = {
  pending:  {
    label: "Awaiting owner review",
    icon: "🕐",
    classes: "bg-amber-50 border-amber-100",
    textClasses: "text-amber-800",
    subtext: "The venue owner has received your request and will respond shortly.",
  },
  accepted: {
    label: "Owner approved your request",
    icon: "✅",
    classes: "bg-emerald-50 border-emerald-100",
    textClasses: "text-emerald-800",
    subtext: "Great news! The venue owner has accepted your booking request.",
  },
  rejected: {
    label: "Owner declined your request",
    icon: "❌",
    classes: "bg-red-50 border-red-100",
    textClasses: "text-red-700",
    subtext: "The venue owner was unable to accommodate your request.",
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-slate-800 mt-0.5 text-sm">{value}</p>
    </div>
  );
}

function OwnerStatusBanner({ ownerStatus, cancellationReason }) {
  const cfg = OWNER_STATUS_CONFIG[ownerStatus] ?? OWNER_STATUS_CONFIG.pending;

  return (
    <div className={`rounded-xl border p-4 ${cfg.classes}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0 mt-0.5">{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${cfg.textClasses}`}>{cfg.label}</p>
          <p className={`text-xs mt-0.5 ${cfg.textClasses} opacity-80`}>{cfg.subtext}</p>

          {/* Rejection reason — shown if owner rejected and there's a reason */}
          {ownerStatus === "rejected" && cancellationReason && (
            <div className="mt-3 pt-3 border-t border-red-100">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide mb-1">
                Reason from owner
              </p>
              <p className="text-sm text-red-700">{cancellationReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((state) => state.bookings);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchBookingDetailAsync(Number(id)));
  }, [dispatch, id]);

  const handleCancel = async () => {
    setCancelling(true);
    const result = await dispatch(cancelBookingAsync({ id: Number(id), reason }));
    setCancelling(false);
    if (cancelBookingAsync.fulfilled.match(result)) {
      setShowCancelModal(false);
      setReason("");
    }
  };

  // ── Loading ──
  if (loading && !current) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] p-6">
        <p className="text-rose-600 text-sm">{error}</p>
        <Link to="/my-bookings" className="text-sm text-blue-600 mt-2 inline-block hover:underline">
          ← My bookings
        </Link>
      </div>
    );
  }

  if (!current) return null;

  const ownerStatus   = current.owner_status;
  const bookingStatus = current.status;

  const paymentCfg = PAYMENT_STATUS_STYLES[bookingStatus] ?? {
    label: bookingStatus,
    classes: "bg-slate-100 text-slate-500 border border-slate-200",
  };

  const formattedDate = current.booking_date
    ? new Date(current.booking_date).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "—";
  const formattedTime = current.time_slot
    ? new Date(`1970-01-01T${current.time_slot}`).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
    : "—";

  // What actions can the customer take?
  const canPayNow  = ownerStatus === "accepted" && bookingStatus === "pending_payment";
  const canCancel  = bookingStatus !== "cancelled" && ownerStatus !== "rejected";

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto max-w-xl px-4 py-6">
        {/* Breadcrumb */}
        <Link to="/my-bookings" className="text-sm text-rose-600 hover:underline flex items-center gap-1 mb-5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          My Bookings
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">

          {/* Venue name + payment status badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Booking ref</p>
              <h1 className="text-xl font-bold text-slate-900">
                #BKM{current.id}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {current.venue_name || `Venue #${current.venue_id}`}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${paymentCfg.classes}`}>
              {paymentCfg.label}
            </span>
          </div>

          {/* Owner decision banner — always visible */}
          <OwnerStatusBanner
            ownerStatus={ownerStatus}
            cancellationReason={current.cancellation_reason}
          />

          {/* Booking details grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <InfoRow label="Date"   value={formattedDate} />
            <InfoRow label="Time"   value={formattedTime} />
            <InfoRow label="Amount" value={`₹${Number(current.amount).toLocaleString("en-IN")}`} />
            {current.event_type && (
              <InfoRow label="Event" value={current.event_type} />
            )}
            {current.guest_count && (
              <InfoRow label="Guests" value={`${current.guest_count} expected`} />
            )}
          </div>

          {/* Notes */}
          {current.notes && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-slate-700">{current.notes}</p>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className="space-y-2.5 pt-1">

            {/* Pay Now — owner accepted, payment still pending */}
            {canPayNow && (
              <button
                onClick={() => navigate(`/checkout/${current.id}`)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pay now — ₹{Number(current.amount).toLocaleString("en-IN")}
              </button>
            )}

            {/* Browse other venues — if rejected */}
            {ownerStatus === "rejected" && (
              <Link
                to="/venues"
                className="block w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-sm font-bold transition-colors"
              >
                Browse other venues
              </Link>
            )}

            {/* Cancel — only if still cancellable */}
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel booking
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Cancel booking modal ── */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Cancel this booking?</h2>
              <p className="text-xs text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 resize-none transition-all"
              placeholder="Reason for cancellation (optional)"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCancelModal(false); setReason(""); }}
                disabled={cancelling}
                className="flex-1 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Keep booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {cancelling
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : "Confirm cancel"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDetailPage;