import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Mail, Phone, User } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { fetchOwnerBookings, parseBookingError } from "@/apis/bookings"
import { fetchMyVenues } from "@/apis/venues"

const bookingTabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "history", label: "History" },
  { id: "cancelled", label: "Cancelled" },
]

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

function formatTimeRange(startTime, endTime) {
  if (!startTime || !endTime) return "—"

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const hour = hours % 12 || 12
    return `${hour}:${String(minutes).padStart(2, "0")} ${period}`
  }

  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}

function statusClasses(status) {
  const styles = {
    confirmed: "bg-primary/10 text-primary border-primary/20",
    pending: "bg-accent/15 text-foreground border-accent/30",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  }

  return styles[status] || styles.completed
}

function isUpcomingBooking(booking) {
  if (booking.status !== "confirmed") return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(booking.eventDate) >= today
}

function isHistoryBooking(booking) {
  if (booking.status === "cancelled") return false
  if (booking.status === "completed") return true

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return booking.status === "confirmed" && new Date(booking.eventDate) < today
}

function isCancelledBooking(booking) {
  return booking.status === "cancelled"
}

function filterBookings(bookings, tab) {
  if (tab === "upcoming") return bookings.filter(isUpcomingBooking)
  if (tab === "history") return bookings.filter(isHistoryBooking)
  return bookings.filter(isCancelledBooking)
}

function emptyMessage(tab) {
  if (tab === "upcoming") return "No upcoming bookings."
  if (tab === "history") return "No booking history yet."
  return "No cancelled bookings."
}

function BookingCard({ booking }) {
  const customerLabel =
    booking.customerName ||
    booking.customerEmail ||
    booking.customerPhone ||
    "Customer"

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            {booking.venueName}
          </h2>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Booking ID: {booking.id}
          </p>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClasses(booking.status)}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="mt-5 grid gap-4 border-t border-border/60 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Event Date
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {formatDate(booking.eventDate)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Time Slot
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {formatTimeRange(booking.startTime, booking.endTime)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Booked On
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {formatDate(booking.bookingDate)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Amount
          </p>
          <p className="mt-1 font-serif text-xl font-semibold text-foreground">
            {formatCurrency(booking.amount)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Customer
        </p>
        <div className="mt-2 flex flex-col gap-1.5 text-sm text-foreground">
          <p className="flex items-center gap-2 font-medium">
            <User size={14} className="shrink-0 text-muted-foreground" />
            {customerLabel}
          </p>
          {booking.customerEmail && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail size={14} className="shrink-0" />
              {booking.customerEmail}
            </p>
          )}
          {booking.customerPhone && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone size={14} className="shrink-0" />
              {booking.customerPhone}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function VenueBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [venueFilter, setVenueFilter] = useState("")

  useEffect(() => {
    let cancelled = false

    fetchMyVenues()
      .then((data) => {
        if (!cancelled) setVenues(data)
      })
      .catch(() => {
        // Venue filter is optional; ignore load errors here.
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadBookings = async () => {
      setLoading(true)
      setError("")

      try {
        const params = venueFilter ? { venue: venueFilter } : {}
        const data = await fetchOwnerBookings(params)
        if (!cancelled) setBookings(data)
      } catch (err) {
        if (!cancelled) setError(parseBookingError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBookings()
    return () => {
      cancelled = true
    }
  }, [venueFilter])

  const visibleBookings = useMemo(
    () => filterBookings(bookings, activeTab),
    [bookings, activeTab],
  )

  const tabCounts = useMemo(
    () => ({
      upcoming: filterBookings(bookings, "upcoming").length,
      history: filterBookings(bookings, "history").length,
      cancelled: filterBookings(bookings, "cancelled").length,
    }),
    [bookings],
  )

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage reservations across your venues.
          </p>
        </div>

        {venues.length > 1 && (
          <select
            value={venueFilter}
            onChange={(event) => setVenueFilter(event.target.value)}
            className="rounded-xl border border-border/60 bg-white px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary"
          >
            <option value="">All venues</option>
            {venues.map((venue) => (
              <option key={venue.slug} value={venue.slug}>
                {venue.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            {bookings.length} total booking{bookings.length === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap gap-1 rounded-full border border-border bg-background p-1">
            {bookingTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tabCounts[tab.id] > 0 && (
                  <span className="ml-1.5 text-xs opacity-80">
                    ({tabCounts[tab.id]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
            />
          ))}
        </div>
      )}

      {!loading && !error && visibleBookings.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-white/70 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays size={28} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {emptyMessage(activeTab)}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {activeTab === "upcoming"
              ? "Confirmed bookings with upcoming event dates will appear here."
              : activeTab === "history"
                ? "Past and completed bookings will show up here once events are over."
                : "Bookings cancelled by customers will be listed here."}
          </p>
        </div>
      )}

      {!loading && !error && visibleBookings.length > 0 && (
        <div className="mt-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
