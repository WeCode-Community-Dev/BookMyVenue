import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Building2,
  CalendarDays,
  CalendarClock,
  ChevronRight,
  Plus,
} from "lucide-react"

import { fetchOwnerBookings, parseBookingError } from "@/apis/bookings"
import { fetchMyVenues, parseVenueError } from "@/apis/venues"
import { useAuth } from "@/contexts/AuthContext"

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

function isUpcomingBooking(booking) {
  if (booking.status !== "confirmed") return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(booking.eventDate) >= today
}

function isWithinLastDays(value, days) {
  if (!value) return false

  const date = new Date(value)
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() - days)

  return date >= cutoff
}

function Stat({ label, value, loading }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      {loading ? (
        <div className="mt-2 h-8 w-20 animate-pulse rounded-lg bg-muted" />
      ) : (
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      )}
    </div>
  )
}

function QuickAction({ to, title, description, state }) {
  return (
    <Link
      to={to}
      state={state}
      className="rounded-xl bg-muted px-4 py-3 text-left transition hover:opacity-90"
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{description}</div>
    </Link>
  )
}

function RecentBookingRow({ booking }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {booking.venueName}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDate(booking.eventDate)} ·{" "}
          {formatTimeRange(booking.startTime, booking.endTime)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-foreground">
          {formatCurrency(booking.amount)}
        </p>
        <p className="mt-0.5 text-xs capitalize text-muted-foreground">
          {booking.status}
        </p>
      </div>
    </div>
  )
}

export default function VenueDashboardPage() {
  const { user } = useAuth()
  const [venues, setVenues] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadDashboard = async () => {
      setLoading(true)
      setError("")

      try {
        const [venueData, bookingData] = await Promise.all([
          fetchMyVenues(),
          fetchOwnerBookings(),
        ])

        if (!cancelled) {
          setVenues(venueData)
          setBookings(bookingData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(parseBookingError(err) || parseVenueError(err))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const upcoming = bookings.filter(isUpcomingBooking)
    const pendingVenues = venues.filter(
      (venue) => venue.status === "pending_approval",
    )
    const revenue30d = bookings
      .filter(
        (booking) =>
          booking.status !== "cancelled" &&
          isWithinLastDays(booking.confirmedAt || booking.bookingDate, 30),
      )
      .reduce((sum, booking) => sum + booking.amount, 0)

    return {
      upcomingCount: upcoming.length,
      pendingVenuesCount: pendingVenues.length,
      revenue30d,
      activeVenuesCount: venues.filter((venue) => venue.status === "approved")
        .length,
    }
  }, [bookings, venues])

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter(isUpcomingBooking)
        .sort(
          (left, right) =>
            new Date(left.eventDate) - new Date(right.eventDate),
        ),
    [bookings],
  )

  const venuesNeedingAttention = useMemo(
    () =>
      venues.filter(
        (venue) =>
          venue.status === "pending_approval" || venue.has_slots === false,
      ),
    [venues],
  )

  const firstVenueNeedingSlots = venues.find((venue) => venue.has_slots === false)

  const greetingName =
    user?.full_name?.trim().split(" ")[0] || user?.email?.split("@")[0] || "there"

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Welcome back, {greetingName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading your venue overview..."
              : `You have ${stats.activeVenuesCount} active venue${stats.activeVenuesCount === 1 ? "" : "s"} and ${stats.upcomingCount} upcoming booking${stats.upcomingCount === 1 ? "" : "s"}.`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            className="rounded-xl bg-muted px-4 py-2 text-sm font-medium hover:opacity-90"
            to="bookings"
          >
            View bookings
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            to="venues/add"
          >
            <Plus size={16} />
            Add listing
          </Link>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat
          label="Upcoming bookings"
          value={stats.upcomingCount}
          loading={loading}
        />
        <Stat
          label="Pending approval"
          value={stats.pendingVenuesCount}
          loading={loading}
        />
        <Stat
          label="Revenue (30d)"
          value={formatCurrency(stats.revenue30d)}
          loading={loading}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Upcoming bookings</h2>
            <Link
              to="bookings"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-90"
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading && (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-muted/60"
                />
              ))}
            </div>
          )}

          {!loading && upcomingBookings.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-white/70 px-4 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarDays size={22} />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                No upcoming bookings
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Confirmed reservations will appear here once customers book your
                venues.
              </p>
            </div>
          )}

          {!loading && upcomingBookings.length > 0 && (
            <div className="mt-4 space-y-3">
              {upcomingBookings.slice(0, 5).map((booking) => (
                <RecentBookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Venues overview</h2>
            <Link
              to="venues"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-90"
            >
              Manage
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading && (
            <div className="mt-4 space-y-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-muted/60"
                />
              ))}
            </div>
          )}

          {!loading && venues.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-white/70 px-4 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 size={22} />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                No venues yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add your first listing to start accepting bookings.
              </p>
              <Link
                to="venues/add"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Plus size={16} />
                Add venue
              </Link>
            </div>
          )}

          {!loading && venues.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <p className="text-xs text-muted-foreground">Total venues</p>
                  <p className="mt-1 text-xl font-semibold">{venues.length}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="mt-1 text-xl font-semibold">
                    {stats.activeVenuesCount}
                  </p>
                </div>
              </div>

              {venuesNeedingAttention.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Needs attention
                  </p>
                  {venuesNeedingAttention.slice(0, 3).map((venue) => (
                    <Link
                      key={venue.slug}
                      to={`venues/${venue.slug}`}
                      state={
                        venue.has_slots === false ? { activeTab: "slots" } : undefined
                      }
                      className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm transition hover:opacity-90"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-amber-950">
                          {venue.name}
                        </p>
                        <p className="mt-0.5 text-xs text-amber-800">
                          {venue.status === "pending_approval"
                            ? "Awaiting admin approval"
                            : "Slots not configured yet"}
                        </p>
                      </div>
                      <CalendarClock
                        size={16}
                        className="shrink-0 text-amber-700"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="text-base font-semibold">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <QuickAction
            to={
              firstVenueNeedingSlots
                ? `venues/${firstVenueNeedingSlots.slug}`
                : "venues"
            }
            state={
              firstVenueNeedingSlots ? { activeTab: "slots" } : undefined
            }
            title="Update availability"
            description="Block dates and configure slots"
          />
          <QuickAction
            to="venues"
            title="Manage venues"
            description="Edit listings, photos, and details"
          />
          <QuickAction
            to="bookings"
            title="View bookings"
            description="See reservations and customer details"
          />
        </div>
      </section>
    </div>
  )
}
