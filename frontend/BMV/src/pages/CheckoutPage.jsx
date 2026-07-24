import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  initiatePaymentAsync,
  confirmPaymentAsync,
  resetPayment,
  clearPaymentError,
} from "../modules/payments/paymentSlice";

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

function CheckoutPage() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useSelector((state) => state.payments);
  const { user } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    dispatch(initiatePaymentAsync(Number(bookingId)));
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch, bookingId]);

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

    // Public key comes from backend RAZORPAY_API_KEY — no frontend env needed
    const key = current.key_id;
    if (!key) {
      setLocalError("Razorpay key is not configured on the server.");
      setPaying(false);
      return;
    }

    const options = {
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

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (resp) => {
      setPaying(false);
      setLocalError(resp.error?.description || "Payment failed at Razorpay.");
    });
    razorpay.open();
  }, [bookingId, current, dispatch, navigate, user]);

  const displayError = localError || error;
  const amountInr = current ? Number(current.amount).toLocaleString("en-IN") : null;

  return (
    <div className="max-w-md space-y-4">
      <Link to={`/bookings/${bookingId}`} className="text-sm text-rose-800 hover:underline">
        ← Back to booking
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
        <p className="text-sm text-slate-500 mt-1">Complete payment for booking #{bookingId}</p>
      </div>

      {loading && !current && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-rose-900 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {displayError && (
        <p className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl">{displayError}</p>
      )}

      {current && (
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Payment ID</span>
            <span className="font-mono text-slate-700">{current.payment_id}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-500">Amount</span>
            <span className="text-2xl font-bold text-slate-900">₹{amountInr}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="capitalize text-slate-700">{current.status?.replace("_", " ")}</span>
          </div>

          {current.status === "paid" ? (
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
                onClick={() => dispatch(initiatePaymentAsync(Number(bookingId)))}
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
              {paying || loading ? "Opening Razorpay..." : "Pay with Razorpay"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
