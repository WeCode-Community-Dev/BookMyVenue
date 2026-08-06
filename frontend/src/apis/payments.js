import api from "../lib/axios"

const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
}

export function parsePaymentError(error) {
  const data = error.response?.data
  if (!data) return "Payment verification failed."
  if (typeof data.message === "string") return data.message
  if (typeof data.detail === "string") return data.detail
  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0]
    const value = data[firstKey]
    if (Array.isArray(value)) return value[0]
    if (typeof value === "string") return value
  }
  return "Payment verification failed."
}

export async function verifyPayment({
  bookingSessionId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const { data } = await api.post(
    "/payments/verify/",
    {
      booking_session_id: bookingSessionId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    },
    apiConfig,
  )
  return data
}

export function transactionFromApi(entry) {
  const venue = entry.venue ?? {}
  const customer = entry.customer ?? {}

  return {
    id: entry.id,
    provider: entry.provider ?? "",
    status: entry.status ?? "",
    amount: Number(entry.amount ?? 0),
    currency: entry.currency ?? "INR",
    verifiedAt: entry.verified_at ?? null,
    createdAt: entry.created_at ?? null,
    razorpayOrderId: entry.razorpay_order_id ?? "",
    razorpayPaymentId: entry.razorpay_payment_id ?? null,
    bookingId: entry.booking_id ?? null,
    bookingStatus: entry.booking_status ?? null,
    eventDate: entry.event_date ?? null,
    venueName: venue.name ?? "",
    venueSlug: venue.slug ?? "",
    customerName: customer.full_name ?? "",
    customerEmail: customer.email ?? "",
    customerPhone: customer.phone ?? "",
  }
}

export function transactionSummaryFromApi(entry) {
  return {
    totalCollected: Number(entry.total_collected ?? 0),
    collectedThisMonth: Number(entry.collected_this_month ?? 0),
    successfulCount: entry.successful_count ?? 0,
    pendingCount: entry.pending_count ?? 0,
    failedCount: entry.failed_count ?? 0,
    refundedTotal: Number(entry.refunded_total ?? 0),
    transactionCount: entry.transaction_count ?? 0,
  }
}

export async function fetchOwnerTransactions(params = {}) {
  const { data } = await api.get("/payments/transactions/", {
    ...apiConfig,
    params: { mine: true, limit: 100, ...params },
  })

  const results = data.results ?? data
  return {
    transactions: (Array.isArray(results) ? results : []).map(transactionFromApi),
    summary: transactionSummaryFromApi(data.summary ?? {}),
    count: data.count ?? 0,
    next: data.next ?? null,
    previous: data.previous ?? null,
  }
}
