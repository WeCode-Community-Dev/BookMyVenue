// Vite loads env vars at build/dev startup — restart `npm run dev` after editing frontend/.env

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const razorpayKeyFromEnv = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const isRazorpayConfigured = () =>
  Boolean(razorpayKeyFromEnv?.trim());

const getRazorpayKeyId = () => {
  const key = razorpayKeyFromEnv?.trim();

  if (!key) {
    throw new Error(
      "Payment is temporarily unavailable. Razorpay is not configured (VITE_RAZORPAY_KEY_ID)."
    );
  }

  return key;
};

const isValidOrder = (order) => {
  if (!order || typeof order !== "object") return false;

  const amount = Number(order.amount);
  const orderId = order.id;
  const currency = order.currency;

  return (
    hasValue(orderId) &&
    Number.isFinite(amount) &&
    amount > 0 &&
    hasValue(currency)
  );
};

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const useRazorpay = () => {
  const openCheckout = async (order, options = {}) => {
    if (!isRazorpayConfigured()) {
      throw new Error(
        "Payment is temporarily unavailable. Razorpay is not configured (VITE_RAZORPAY_KEY_ID)."
      );
    }

    if (!isValidOrder(order)) {
      throw new Error("Invalid payment order. Please try booking again.");
    }

    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      throw new Error("Failed to load Razorpay. Please try again.");
    }

    const key = getRazorpayKeyId();

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: options.name || "BookMyVenue",
        description: options.description || "Venue booking",
        handler: (response) => resolve(response),
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled."));
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        reject(
          new Error(
            response.error?.description || "Payment failed. Please try again."
          )
        );
      });

      razorpay.open();
    });
  };

  return { openCheckout, isRazorpayConfigured };
};

export default useRazorpay;
