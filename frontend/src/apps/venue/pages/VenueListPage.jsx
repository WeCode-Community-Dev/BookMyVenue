import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Building2,
  CalendarClock,
  MapPin,
  Plus,
  Users,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"

import {
  fetchMyVenues,
  formatVenuePrice,
  parseVenueError,
  VENUE_BOOKING_TYPES,
  VENUE_STATUS_LABELS,
  VENUE_STATUS_STYLES,
} from "@/apis/venues"

function bookingTypeLabel(value) {
  return VENUE_BOOKING_TYPES.find((item) => item.value === value)?.label ?? value
}

function formatLocation(city) {
  if (!city) return "—"
  const districtName =
    typeof city.district === "object" && city.district
      ? city.district.name
      : city.district
  return [city.name, districtName].filter(Boolean).join(", ")
}

function VenueCard({ venue }) {
  const statusClass =
    VENUE_STATUS_STYLES[venue.status] ?? "bg-slate-100 text-slate-600 border-slate-200"
  const statusLabel = VENUE_STATUS_LABELS[venue.status] ?? venue.status
  const needsSlots = venue.has_slots === false

  return (
    <Link
      to={`/venue/venues/${venue.slug}`}
      state={needsSlots ? { activeTab: "slots" } : undefined}
      className="block"
    >
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer"
    >
      <div className="relative h-44 bg-secondary">
        {venue.cover_image ? (
          <img
            src={venue.cover_image}
            alt={venue.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Building2 size={32} className="opacity-40" />
            <span className="text-xs font-medium">No image</span>
          </div>
        )}

        <span
          className={`absolute top-3 right-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-serif text-lg font-semibold text-foreground">
              {venue.name}
            </h2>
            {venue.category?.name && (
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-primary">
                {venue.category.name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-primary/70" />
            <span className="line-clamp-1">
              {formatLocation(venue.city)}
              {venue.address ? ` · ${venue.address}` : ""}
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-primary/70" />
              <span>{venue.capacity} guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary/70" />
              <span>{bookingTypeLabel(venue.booking_type)}</span>
            </div>
          </div>

          {venue.min_price != null && (
            <p className="text-sm font-semibold text-foreground">
              From {formatVenuePrice(venue.min_price)}
            </p>
          )}

          {needsSlots && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <CalendarClock size={14} className="mt-0.5 shrink-0 text-amber-700" />
              <span>
                No slots configured yet. Set up availability to start accepting
                bookings.
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.article>
    </Link>
  )
}

export default function VenueListPage() {
  const location = useLocation()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState(
    location.state?.createdVenue
      ? `"${location.state.createdVenue}" was created and is pending approval.`
      : "",
  )

  useEffect(() => {
    if (!location.state?.createdVenue) return undefined

    window.history.replaceState({}, document.title)
    const timer = window.setTimeout(() => setSuccessMessage(""), 5000)
    return () => window.clearTimeout(timer)
  }, [location.state])

  useEffect(() => {
    let cancelled = false

    const loadVenues = async () => {
      setLoading(true)
      setError("")

      try {
        const data = await fetchMyVenues()
        if (!cancelled) setVenues(data)
      } catch (err) {
        if (!cancelled) setError(parseVenueError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadVenues()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            My Venues
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your venue listings and add new ones to the platform.
          </p>
        </div>

        <Link
          to="/venue/venues/add"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add New Venue
        </Link>
      </div>

      {successMessage && (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      )}

      {error && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
            />
          ))}
        </div>
      )}

      {!loading && !error && venues.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-white/70 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 size={28} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No venues yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create your first venue listing to start receiving bookings on
            BookMyVenue.
          </p>
          <Link
            to="/venue/venues/add"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} />
            Create your first venue
          </Link>
        </div>
      )}

      {!loading && !error && venues.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue.slug} venue={venue} />
          ))}
        </div>
      )}
    </div>
  )
}
