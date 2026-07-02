import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  initiatePaymentAsync,
  confirmPaymentAsync,
  resetPayment,
} from "../modules/payments/paymentSlice";

function CheckoutPage() {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useSelector((state) => state.payments);
  const [done, setDone] = useState(false);

  useEffect(() => {
    dispatch(initiatePaymentAsync(Number(bookingId)));
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch, bookingId]);

  const handlePay = async (success) => {
    if (!current) return;
    const result = await dispatch(
      confirmPaymentAsync({ paymentId: current.payment_id, success }),
    );
    if (confirmPaymentAsync.fulfilled.match(result)) {
      setDone(true);
      if (result.payload.status === "paid") {
        setTimeout(() => navigate("/order-history"), 1200);
      }
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold">Checkout</h1>

      {loading && !current && <p>Preparing payment...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {current && (
        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment ID</span>
            <span className="font-mono text-sm">{current.payment_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold">
              {current.currency} {current.amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span>{current.status}</span>
          </div>

          {current.status === "paid" ? (
            <p className="rounded bg-green-50 p-3 text-green-700">
              Payment successful. Redirecting to your bookings...
            </p>
          ) : current.status === "failed" ? (
            <p className="rounded bg-red-50 p-3 text-red-700">
              Payment failed. Please try again.
            </p>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handlePay(true)}
                disabled={loading || done}
                className="flex-1 rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay now (mock)"}
              </button>
              <button
                onClick={() => handlePay(false)}
                disabled={loading || done}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
              >
                Simulate failure
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
