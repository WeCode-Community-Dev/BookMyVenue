import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingDetailAsync } from "../modules/bookings/bookingSlice";
import {
  initiatePaymentAsync,
  confirmPaymentAsync,
  resetPayment,
} from "../modules/payments/paymentSlice";

// ─── Icons ───────────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ─── Step indicator ──────────────────────────────────────────────────────────

function Steps({ current }) {
  const steps = ["Booking request", "Owner approval", "Payment"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <CheckIcon /> : idx}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                  active ? "text-rose-600" : done ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-12 sm:w-20 mx-1 mb-4 transition-colors ${
                  done ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Payment method mock ─────────────────────────────────────────────────────

function PaymentMethodSelector({ selected, onChange }) {
  const methods = [
    { id: "upi", label: "UPI", icon: "📲", desc: "Google Pay, PhonePe, Paytm" },
    { id: "card", label: "Card", icon: "💳", desc: "Credit or debit card" },
    { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks" },
  ];

  return (
    <div className="space-y-2.5">
      {methods.map((m) => (
        <label
          key={m.id}
          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
            selected === m.id
              ? "border-rose-400 bg-rose-50/60 shadow-sm"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <input
            type="radio"
            name="payment_method"
            value={m.id}
            checked={selected === m.id}
            onChange={() => onChange(m.id)}
            className="accent-rose-600"
          />
          <span className="text-xl">{m.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">{m.label}</p>
            <p className="text-xs text-slate-400">{m.desc}</p>
          </div>
          {selected === m.id && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <CheckIcon />
            </span>
          )}
        </label>
      ))}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

function CheckoutPage() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current: booking, loading: bookingLoading } = useSelector((s) => s.bookings);
  const { current: payment, loading: paymentLoading, error: paymentError } = useSelector((s) => s.payments);

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [phase, setPhase] = useState("select"); // "select" | "processing" | "success" | "failed"

  useEffect(() => {
    dispatch(fetchBookingDetailAsync(Number(bookingId)));
    dispatch(resetPayment());
  }, [dispatch, bookingId]);

  // Guard — if booking isn't in the right state, redirect
  useEffect(() => {
    if (!booking) return;
    if (booking.owner_status !== "accepted") {
      navigate(`/booking-confirmed/${bookingId}`, { replace: true });
    }
    if (booking.status === "booked") {
      setPhase("success");
    }
  }, [booking, bookingId, navigate]);

  const handlePay = async () => {
    setPhase("processing");

    // Step 1: initiate — creates the payment record, gets a payment_id
    const initiateResult = await dispatch(initiatePaymentAsync(Number(bookingId)));
    if (!initiatePaymentAsync.fulfilled.match(initiateResult)) {
      setPhase("failed");
      return;
    }

    const paymentId = initiateResult.payload.payment_id;

    // Step 2: confirm — mock success = true
    const confirmResult = await dispatch(confirmPaymentAsync({ paymentId, success: true }));
    if (confirmPaymentAsync.fulfilled.match(confirmResult)) {
      setPhase("success");
    } else {
      setPhase("failed");
    }
  };

  // ── Loading state ──
  if (bookingLoading && !booking) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-sm">Booking not found.</p>
          <Link to="/my-bookings" className="text-sm text-rose-600 hover:underline mt-2 inline-block">
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(booking.booking_date).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });
  const formattedTime = booking.time_slot
    ? new Date(`1970-01-01T${booking.time_slot}`).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
    : "—";
  const amountStr = `₹${Number(booking.amount).toLocaleString("en-IN")}`;

  // ── Success screen ──
  if (phase === "success") {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment successful!</h1>
            <p className="text-sm text-slate-500 mb-1">
              Your venue is now secured for {formattedDate}.
            </p>
            <p className="text-xs text-slate-400 mb-8">
              Booking ref: <span className="font-semibold text-slate-600">#BKM{booking.id}</span>
            </p>
            <div className="space-y-3">
              <Link
                to="/my-bookings"
                className="block w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors"
              >
                View My Bookings
              </Link>
              <Link
                to="/venues"
                className="block w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Browse more venues
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Failed screen ──
  if (phase === "failed") {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment failed</h1>
            <p className="text-sm text-slate-500 mb-8">
              Something went wrong with the payment. Your booking is still held — you can try again.
            </p>
            {paymentError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-sm text-red-600">
                {paymentError}
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={() => setPhase("select")}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors"
              >
                Try again
              </button>
              <Link
                to="/my-bookings"
                className="block w-full border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Pay later from My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Select / Processing screen ──
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <Header />

      <div className="flex-1 mx-auto max-w-2xl w-full px-4 py-8">
        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <Steps current={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* Left — payment method */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-700 mb-4">Choose payment method</h2>
              <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
              <ShieldIcon />
              Payments are secured and encrypted end-to-end.
            </div>
          </div>

          {/* Right — order summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Order summary</h2>

              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarIcon />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ClockIcon />
                  <span>{formattedTime}</span>
                </div>
                {booking.event_type && (
                  <div className="text-slate-500 text-xs">
                    {booking.event_type}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-50 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Venue fee</span>
                  <span className="font-medium text-slate-800">{amountStr}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Platform fee</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-100">
                  <span className="text-slate-800">Total</span>
                  <span className="text-rose-700">{amountStr}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={phase === "processing" || paymentLoading}
                className="w-full mt-5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {phase === "processing" || paymentLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  `Pay ${amountStr}`
                )}
              </button>

              <Link
                to="/my-bookings"
                className="block w-full text-center mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Pay later — I'll come back to this
              </Link>

              <p className="text-[10px] text-slate-300 text-center mt-3">
                Booking ref: #BKM{booking.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">BMV</div>
          <span className="font-bold text-slate-800 text-lg hidden sm:inline">BookMyVenue</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldIcon />
          Secure checkout
        </div>
      </div>
    </header>
  );
}

export default CheckoutPage;
