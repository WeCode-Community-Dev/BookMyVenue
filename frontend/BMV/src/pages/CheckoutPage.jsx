import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  initiatePaymentAsync,
  confirmPaymentAsync,
  resetPayment,
  clearPaymentError,
} from "../modules/payments/paymentSlice";
import { fetchBookingDetailAsync } from "../modules/bookings/bookingSlice";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

const inr = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

function CheckoutPage() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useSelector((state) => state.payments);
  const { current: booking } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState("");
  const [paying, setPaying] = useState(false);
  const [option, setOption] = useState("full");

  useEffect(() => {
    dispatch(fetchBookingDetailAsync(Number(bookingId)));
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch, bookingId]);

  const bookingLoaded = booking && booking.id === Number(bookingId);
  const advancePercent = bookingLoaded ? booking.advance_percent ?? 30 : 30;
  const allowPayAtVenue = bookingLoaded ? booking.allow_pay_at_venue !== false : false;
  const total = bookingLoaded ? Number(booking.amount) : 0;

  const advanceAmount = useMemo(
    () => Math.round(total * (advancePercent / 100) * 100) / 100,
    [total, advancePercent],
  );

  const options = useMemo(() => {
    const list = [
      {
        key: "full",
        title: "Pay full amount",
        subtitle: "Settle everything now",
        amount: total,
      },
      {
        key: "advance",
        title: `Pay ${advancePercent}% advance`,
        subtitle: `Balance ${inr(total - advanceAmount)} due at the venue`,
        amount: advanceAmount,
      },
    ];
    if (allowPayAtVenue) {
      list.push({
        key: "pay_at_venue",
        title: "Pay at venue",
        subtitle: "Reserve now, pay the full amount on arrival",
        amount: 0,
      });
    }
    return list;
  }, [total, advancePercent, advanceAmount, allowPayAtVenue]);

  const handleContinue = async () => {
    setLocalError("");
    dispatch(clearPaymentError());
    const result = await dispatch(
      initiatePaymentAsync({ bookingId: Number(bookingId), paymentOption: option }),
    );
    if (
      initiatePaymentAsync.fulfilled.match(result) &&
      result.payload?.payment_type === "pay_at_venue"
    ) {
      setTimeout(() => navigate(`/bookings/${bookingId}`), 1200);
    }
  };

  const handleRazorpayPay = useCallback(async () => {
    if (!current?.gateway_order_id) {
      setLocalError("Payment order is not ready. Please refresh and try again.");
      return;
    }

    setLocalError("");
    dispatch(clearPaymentError());
    setPaying(true);

    try {
      await loadRazorpayScript();
    } catch (err) {
      setLocalError(err.message || "Could not load Razorpay");
      setPaying(false);
      return;
    }

    const key = current.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      setLocalError("Razorpay key is not configured.");
      setPaying(false);
      return;
    }

    const checkoutOptions = {
      key,
      amount: Math.round(Number(current.amount) * 100),
      currency: current.currency || "INR",
      order_id: current.gateway_order_id,
      name: "BookMyVenue",
      description: `Booking #${bookingId}`,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone_number || "",
      },
      theme: { color: "#881337" },
      handler: async (response) => {
        const result = await dispatch(
          confirmPaymentAsync({
            payment_id: current.payment_id,
            gateway_order_id: response.razorpay_order_id,
            gateway_payment_id: response.razorpay_payment_id,
            gateway_signature: response.razorpay_signature,
          }),
        );
        setPaying(false);
        if (confirmPaymentAsync.fulfilled.match(result)) {
          setTimeout(() => navigate(`/bookings/${bookingId}`), 1200);
        }
      },
      modal: {
        ondismiss: () => {
          setPaying(false);
          setLocalError("Payment cancelled. You can try again when ready.");
        },
      },
    };

    const razorpay = new window.Razorpay(checkoutOptions);
    razorpay.on("payment.failed", (resp) => {
      setPaying(false);
      setLocalError(resp.error?.description || "Payment failed at Razorpay.");
    });
    razorpay.open();
  }, [bookingId, current, dispatch, navigate, user]);

  const displayError = localError || error;
  const alreadySettled = bookingLoaded && booking.status !== "pending_payment";

  return (
    <div className="max-w-md space-y-4">
      <Link to={`/bookings/${bookingId}`} className="text-sm text-rose-800 hover:underline">
        ← Back to booking
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">Complete payment for booking #{bookingId}</p>
      </div>

      {!bookingLoaded && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-rose-900 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {displayError && (
        <p className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl">{displayError}</p>
      )}

      {bookingLoaded && alreadySettled && !current && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-3">
          <p className="text-sm text-slate-600">
            This booking is no longer awaiting payment.
          </p>
          {Number(booking.balance_due) > 0 && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3">
              Balance of {inr(booking.balance_due)} is collected at the venue.
            </p>
          )}
          <Link
            to={`/bookings/${bookingId}`}
            className="block text-center rounded-xl bg-rose-900 py-2.5 text-sm font-semibold text-white hover:bg-rose-950"
          >
            View booking
          </Link>
        </div>
      )}

      {bookingLoaded && !alreadySettled && !current && (
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-baseline">
            <span className="text-slate-500 text-sm">Booking total</span>
            <span className="text-2xl font-bold text-slate-900">{inr(total)}</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Choose how you want to pay</p>
            {options.map((opt) => (
              <label
                key={opt.key}
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                  option === opt.key
                    ? "border-rose-900 bg-rose-50/50"
                    : "border-slate-200 hover:border-rose-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment_option"
                  value={opt.key}
                  checked={option === opt.key}
                  onChange={() => setOption(opt.key)}
                  className="mt-1 accent-rose-900"
                />
                <span className="flex-1">
                  <span className="flex justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">{opt.title}</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {opt.key === "pay_at_venue" ? "—" : inr(opt.amount)}
                    </span>
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">{opt.subtitle}</span>
                </span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="w-full rounded-xl bg-rose-900 py-3 text-sm font-semibold text-white hover:bg-rose-950 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : option === "pay_at_venue"
                ? "Confirm booking"
                : `Continue to pay ${inr(option === "full" ? total : advanceAmount)}`}
          </button>
        </div>
      )}

      {current && (
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Payment ID</span>
            <span className="font-mono text-slate-700">{current.payment_id}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-500">
              {current.payment_type === "advance" ? "Advance due now" : "Amount"}
            </span>
            <span className="text-2xl font-bold text-slate-900">{inr(current.amount)}</span>
          </div>
          {Number(current.balance_due) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Balance at venue</span>
              <span className="font-medium text-amber-700">{inr(current.balance_due)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="capitalize text-slate-700">{current.status?.replace("_", " ")}</span>
          </div>

          {current.payment_type === "pay_at_venue" ? (
            <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
              Booking confirmed. Pay {inr(current.balance_due)} at the venue. Redirecting...
            </p>
          ) : current.status === "paid" ? (
            <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
              Payment successful. Redirecting to your booking — your check-in QR will appear after
              the owner accepts.
            </p>
          ) : current.status === "failed" ? (
            <div className="space-y-3">
              <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                Payment failed. Please try again.
              </p>
              <button
                type="button"
                onClick={handleContinue}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Create new payment order
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRazorpayPay}
              disabled={loading || paying || !current.gateway_order_id}
              className="w-full rounded-xl bg-rose-900 py-3 text-sm font-semibold text-white hover:bg-rose-950 disabled:opacity-50"
            >
              {paying || loading ? "Opening Razorpay..." : `Pay ${inr(current.amount)} with Razorpay`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
