const RAZORPAY_CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js"
const RAZORPAY_THEME_COLOR = "#2563eb"

export const RazorpayCheckoutStatus = {
  SUCCESS: "SUCCESS",
  PAYMENT_CANCELLED: "PAYMENT_CANCELLED",
  ERROR: "ERROR",
}

let scriptLoadPromise = null

function loadRazorpaySdk() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Razorpay checkout is only available in the browser."),
    )
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay)
  }

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[src="${RAZORPAY_CHECKOUT_SCRIPT}"]`,
      )

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (window.Razorpay) {
            resolve(window.Razorpay)
            return
          }
          scriptLoadPromise = null
          reject(
            new Error(
              "Razorpay SDK loaded but the checkout constructor is unavailable.",
            ),
          )
        })
        existingScript.addEventListener("error", () => {
          scriptLoadPromise = null
          reject(
            new Error(
              "Failed to load Razorpay checkout SDK. Please check your connection and try again.",
            ),
          )
        })
        return
      }

      const script = document.createElement("script")
      script.src = RAZORPAY_CHECKOUT_SCRIPT
      script.async = true
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay)
          return
        }
        scriptLoadPromise = null
        reject(
          new Error(
            "Razorpay SDK loaded but the checkout constructor is unavailable.",
          ),
        )
      }
      script.onerror = () => {
        scriptLoadPromise = null
        reject(
          new Error(
            "Failed to load Razorpay checkout SDK. Please check your connection and try again.",
          ),
        )
      }
      document.body.appendChild(script)
    })
  }

  return scriptLoadPromise
}

function normalizeBookingResponse(bookingResponse) {
  const key = bookingResponse?.key
  const amount = bookingResponse?.amount ?? bookingResponse?.amount_paise
  const currency = bookingResponse?.currency
  const orderId =
    bookingResponse?.order?.id ?? bookingResponse?.razorpay_order_id
  const bookingSessionId =
    bookingResponse?.bookingSession?.id ?? bookingResponse?.booking_session_id

  if (!key) {
    throw new Error("Payment gateway key is missing from the booking response.")
  }
  if (amount == null) {
    throw new Error("Payment amount is missing from the booking response.")
  }
  if (!currency) {
    throw new Error("Payment currency is missing from the booking response.")
  }
  if (!orderId) {
    throw new Error("Razorpay order ID is missing from the booking response.")
  }
  if (!bookingSessionId) {
    throw new Error("Booking session ID is missing from the booking response.")
  }

  return {
    key,
    amount,
    currency,
    orderId,
    bookingSessionId,
  }
}

function buildPrefill(prefill = {}) {
  const normalized = {}

  const name = prefill.name ?? prefill.full_name
  const contact = prefill.contact ?? prefill.phone

  if (name) normalized.name = name
  if (prefill.email) normalized.email = prefill.email
  if (contact) normalized.contact = contact

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

export async function openCheckout(bookingResponse, options = {}) {
  try {
    const Razorpay = await loadRazorpaySdk()
    const { key, amount, currency, orderId, bookingSessionId } =
      normalizeBookingResponse(bookingResponse)
    const prefill = buildPrefill(options.prefill)

    return await new Promise((resolve) => {
      let settled = false

      const settle = (result) => {
        if (settled) return
        settled = true
        resolve(result)
      }

      const checkoutOptions = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: options.businessName ?? "BookMyVenue",
        description: options.description ?? "Venue booking payment",
        theme: {
          color: RAZORPAY_THEME_COLOR,
        },
        handler(response) {
          settle({
            status: RazorpayCheckoutStatus.SUCCESS,
            data: {
              booking_session_id: bookingSessionId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
          })
        },
        modal: {
          ondismiss() {
            settle({
              status: RazorpayCheckoutStatus.PAYMENT_CANCELLED,
            })
          },
        },
      }

      if (prefill) {
        checkoutOptions.prefill = prefill
      }

      try {
        const razorpay = new Razorpay(checkoutOptions)

        razorpay.on("payment.failed", (response) => {
          settle({
            status: RazorpayCheckoutStatus.ERROR,
            message:
              response.error?.description ||
              "Payment failed. Please try again.",
          })
        })

        razorpay.open()
      } catch (error) {
        settle({
          status: RazorpayCheckoutStatus.ERROR,
          message:
            error?.message || "Failed to initialize Razorpay checkout.",
        })
      }
    })
  } catch (error) {
    return {
      status: RazorpayCheckoutStatus.ERROR,
      message: error?.message || "Unable to open payment checkout.",
    }
  }
}

const razorpayService = {
  RazorpayCheckoutStatus,
  openCheckout,
}

export default razorpayService
