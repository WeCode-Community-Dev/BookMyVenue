import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  MapPin,
  Phone,
  TicketCheck,
} from "lucide-react"
import { fetchBookingDetail } from "../services/bookingService"

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value) {
  if (!value) return "—"

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

function formatTimeLabel(timeStr) {
  if (!timeStr) return "—"

  const [hours, minutes] = timeStr.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hour = hours % 12 || 12

  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`
}

function formatTimeRange(startTime, endTime) {
  return `${formatTimeLabel(startTime)} - ${formatTimeLabel(endTime)}`
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">{value}</p>
    </div>
  )
}

export default function BookingDetailPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!bookingId) return undefined

    let cancelled = false
    setLoading(true)
    setError("")

    fetchBookingDetail(bookingId)
      .then((detail) => {
        if (!cancelled) setBooking(detail)
      })
      .catch((fetchError) => {
        if (cancelled) return
        console.error("Failed to fetch booking detail:", fetchError)
        setError("Could not load booking details. Please try again.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [bookingId])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-10 pt-32 sm:px-6 sm:pt-36 lg:px-8">
      <Link
        to="/profile?section=bookings"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
      >
        <ChevronLeft size={16} />
        Back to my bookings
      </Link>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">Loading booking details...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : booking ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        >
            <div className="border-b border-border bg-primary/5 px-6 py-8 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Booking confirmed
                  </p>
                  <h1 className="mt-1 font-serif text-3xl font-bold text-foreground">
                    {booking.venueName}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <TicketCheck size={16} />
                    Booking ID: {booking.id}
                  </p>
                </div>
              </div>
            </div>

            {booking.venueCoverImage && (
              <img
                src={booking.venueCoverImage}
                alt={booking.venueName}
                loading="lazy"
                decoding="async"
                className="h-56 w-full object-cover sm:h-72"
              />
            )}

            <div className="space-y-6 px-6 py-8 sm:px-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Event date" value={formatDate(booking.eventDate)} />
                <DetailItem
                  label="Time slot"
                  value={
                    booking.scheduleName ||
                    formatTimeRange(booking.startTime, booking.endTime)
                  }
                />
                <DetailItem label="Status" value={booking.status} />
                <DetailItem label="Amount paid" value={formatCurrency(booking.amount)} />
                <DetailItem label="Confirmed at" value={formatDate(booking.confirmedAt)} />
                <DetailItem label="Payment status" value={booking.paymentStatus || "—"} />
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h2 className="font-serif text-xl font-semibold text-foreground">Venue details</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      {[booking.venueAddress, booking.venueCity].filter(Boolean).join(", ") ||
                        "—"}
                    </span>
                  </p>
                  {booking.venueContactPhone && (
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="shrink-0 text-primary" />
                      <span>{booking.venueContactPhone}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="shrink-0 text-primary" />
                    <span>
                      {formatTimeRange(booking.startTime, booking.endTime)}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="shrink-0 text-primary" />
                    <span>Booking reference {booking.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/venues/${booking.venueSlug}`}
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  View venue
                </Link>
                <Link
                  to="/profile?section=bookings"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Go to my bookings
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
    </main>
  )
}
