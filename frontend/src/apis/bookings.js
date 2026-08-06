import api from "../lib/axios"

const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
}

export function parseBookingError(error) {
  const data = error.response?.data
  if (!data) return "Something went wrong. Please try again."
  if (typeof data.message === "string") return data.message
  if (typeof data.detail === "string") return data.detail
  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0]
    const value = data[firstKey]
    if (Array.isArray(value)) return value[0]
    if (typeof value === "string") return value
  }
  return "Something went wrong. Please try again."
}

export function getStartBookingErrorMessage(error) {
  const status = error.response?.status

  if (status === 409) {
    return parseBookingError(error)
  }

  if (status === 400) {
    return parseBookingError(error)
  }

  if (status >= 500) {
    return "Something went wrong on our end. Please try again later."
  }

  return parseBookingError(error)
}

export function bookingFromApi(entry) {
  const venue = entry.venue ?? {}
  const schedule = entry.schedule ?? {}
  const payment = entry.payment ?? {}
  const customer = entry.customer ?? {}

  return {
    id: entry.id,
    venueName: venue.name ?? entry.venue_name,
    venueSlug: venue.slug ?? entry.venue_slug,
    bookingDate: entry.created_at?.slice(0, 10) ?? entry.created_at,
    eventDate: entry.booking_date,
    amount: Number(entry.booking_amount ?? payment.amount ?? entry.price ?? schedule.price),
    status: entry.status,
    startTime: schedule.start_time?.slice(0, 5) ?? entry.start_time?.slice(0, 5) ?? entry.start_time,
    endTime: schedule.end_time?.slice(0, 5) ?? entry.end_time?.slice(0, 5) ?? entry.end_time,
    confirmedAt: entry.confirmed_at ?? null,
    cancelledAt: entry.cancelled_at ?? null,
    customerName: customer.full_name ?? "",
    customerEmail: customer.email ?? "",
    customerPhone: customer.phone ?? "",
  }
}

export async function startBooking({ venueScheduleId, bookingDate }) {
  const { data } = await api.post(
    "/bookings/start/",
    {
      venue_schedule_id: venueScheduleId,
      booking_date: bookingDate,
    },
    apiConfig,
  )
  return data
}

export async function abandonBookingSession(bookingSessionId) {
  await api.post(
    "/bookings/abandon/",
    { booking_session_id: bookingSessionId },
    apiConfig,
  )
}

export function bookingDetailFromApi(entry) {
  const venue = entry.venue ?? {}
  const schedule = entry.schedule ?? {}
  const payment = entry.payment ?? {}

  return {
    id: entry.id,
    status: typeof entry.status === "string" ? entry.status.toLowerCase() : entry.status,
    eventDate: entry.booking_date,
    amount: Number(entry.booking_amount ?? payment.amount ?? 0),
    confirmedAt: entry.confirmed_at ?? null,
    venueName: venue.name ?? "",
    venueSlug: venue.slug ?? "",
    venueAddress: venue.address ?? "",
    venueCity: venue.city ?? "",
    venueCoverImage: venue.cover_image ?? null,
    venueContactName: venue.contact_name ?? "",
    venueContactPhone: venue.contact_phone ?? "",
    scheduleName: schedule.name ?? "",
    startTime: schedule.start_time ?? "",
    endTime: schedule.end_time ?? "",
    paymentStatus: payment.status ?? "",
    paymentProvider: payment.provider ?? "",
    paymentCurrency: payment.currency ?? "INR",
  }
}

export async function fetchBookingDetail(bookingId) {
  const { data } = await api.get(`/bookings/${bookingId}/`, apiConfig)
  return bookingDetailFromApi(data)
}

export async function fetchBookings(params = {}) {
  const { data } = await api.get("/bookings/", {
    ...apiConfig,
    params: { limit: 100, ...params },
  })
  const results = data.results ?? data
  return (Array.isArray(results) ? results : []).map(bookingFromApi)
}

export async function fetchOwnerBookings(params = {}) {
  const { data } = await api.get("/bookings/", {
    ...apiConfig,
    params: { mine: true, limit: 100, ...params },
  })
  const results = data.results ?? data
  return (Array.isArray(results) ? results : []).map(bookingFromApi)
}

export async function cancelBooking(bookingId) {
  const { data } = await api.patch(
    `/bookings/${bookingId}/`,
    { status: "cancelled" },
    apiConfig,
  )
  return bookingFromApi(data)
}
