import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingDetailAsync } from "../modules/bookings/bookingSlice";

function StatusIcon({ ownerStatus }) {
  if (ownerStatus === "accepted") {
    return (
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (ownerStatus === "rejected") {
    return (
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  // pending
  return (
    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
      <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

function BookingConfirmedPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: booking, loading, error } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchBookingDetailAsync(Number(id)));
  }, [dispatch, id]);

  if (loading && !booking) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-sm">Could not load booking details.</p>
          <Link to="/my-bookings" className="text-sm text-rose-600 hover:underline mt-2 inline-block">
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const ownerStatus = booking.owner_status;
  const bookingStatus = booking.status;

  // Derive the content to show based on current state
  const stateContent = (() => {
    if (ownerStatus === "rejected" || bookingStatus === "cancelled") {
      return {
        heading: "Request not accepted",
        subheading: "The venue owner has reviewed your request and declined it.",
        color: "text-red-700",
        bgBadge: "bg-red-50 border-red-100 text-red-700",
        badgeLabel: "Rejected",
      };
    }
    if (ownerStatus === "accepted" && bookingStatus === "pending_payment") {
      return {
        heading: "Your booking is confirmed!",
        subheading: "The venue owner has accepted your request. Complete your payment to secure the slot.",
        color: "text-emerald-700",
        bgBadge: "bg-emerald-50 border-emerald-100 text-emerald-700",
        badgeLabel: "Accepted",
      };
    }
    if (ownerStatus === "accepted" && bookingStatus === "booked") {
      return {
        heading: "Booking complete",
        subheading: "Payment received. Your venue is secured.",
        color: "text-emerald-700",
        bgBadge: "bg-emerald-50 border-emerald-100 text-emerald-700",
        badgeLabel: "Booked",
      };
    }
    // default: pending owner decision
    return {
      heading: "Request received!",
      subheading: "We've sent your booking request to the venue owner. They'll review it shortly.",
      color: "text-amber-700",
      bgBadge: "bg-amber-50 border-amber-100 text-amber-700",
      badgeLabel: "Awaiting owner review",
    };
  })();

  const formattedDate = booking.booking_date
    ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const formattedTime = booking.time_slot
    ? new Date(`1970-01-01T${booking.time_slot}`).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
    : "—";

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Minimal header */}
      <header className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-3.5 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">BMV</div>
            <span className="font-bold text-slate-800 text-lg hidden sm:inline">BookMyVenue</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Status card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center mb-4">
            <StatusIcon ownerStatus={ownerStatus} />

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${stateContent.bgBadge}`}>
              {stateContent.badgeLabel}
            </span>

            <h1 className="text-xl font-bold text-slate-900 mb-2">{stateContent.heading}</h1>
            <p className="text-sm text-slate-500 leading-relaxed">{stateContent.subheading}</p>

            {/* Rejection reason */}
            {(ownerStatus === "rejected" || bookingStatus === "cancelled") && booking.cancellation_reason && (
              <div className="mt-4 text-left bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Reason from owner</p>
                <p className="text-sm text-red-700">{booking.cancellation_reason}</p>
              </div>
            )}
          </div>

          {/* Booking summary */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Booking summary</h2>
            <div className="space-y-3">
              <SummaryRow label="Booking ref" value={`#BKM${booking.id}`} />
              <SummaryRow label="Date" value={formattedDate} />
              <SummaryRow label="Time" value={formattedTime} />
              {booking.event_type && <SummaryRow label="Event type" value={booking.event_type} />}
              {booking.guest_count && <SummaryRow label="Guests" value={`${booking.guest_count} expected`} />}
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-500">Amount</span>
                <span className="text-base font-bold text-slate-900">
                  ₹{Number(booking.amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons — depend on state */}
          <div className="space-y-3">
            {/* Pay now / pay later — only when accepted + pending_payment */}
            {ownerStatus === "accepted" && bookingStatus === "pending_payment" && (
              <>
                <button
                  onClick={() => navigate(`/checkout/${booking.id}`)}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Pay now — ₹{Number(booking.amount).toLocaleString("en-IN")}
                </button>
                <Link
                  to="/my-bookings"
                  className="block w-full text-center border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 py-3.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Pay later — go to My Bookings
                </Link>
              </>
            )}

            {/* Rejected — options to browse or go to bookings */}
            {(ownerStatus === "rejected" || bookingStatus === "cancelled") && (
              <>
                <Link
                  to="/venues"
                  className="block w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Browse other venues
                </Link>
                <Link
                  to="/my-bookings"
                  className="block w-full text-center border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  View all my bookings
                </Link>
              </>
            )}

            {/* Pending — just let them track */}
            {ownerStatus === "pending" && (
              <>
                <Link
                  to="/my-bookings"
                  className="block w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Track in My Bookings
                </Link>
                <Link
                  to="/venues"
                  className="block w-full text-center border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Continue browsing venues
                </Link>
              </>
            )}

            {/* Fully booked */}
            {bookingStatus === "booked" && (
              <Link
                to="/my-bookings"
                className="block w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors"
              >
                View My Bookings
              </Link>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            You'll receive updates on this booking in your notifications.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-700">{value}</span>
    </div>
  );
}

export default BookingConfirmedPage;