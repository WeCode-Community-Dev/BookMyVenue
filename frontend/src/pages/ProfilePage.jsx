import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Star,
  TicketCheck,
  User,
  X,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { parseAuthError } from "../apis/auth"
import {
  normalizeProfileName,
  normalizeProfilePhone,
  validateProfileName,
  validateProfilePhone,
} from "../utils/profileValidation"
import {
  fetchBookings,
  fetchFavouriteVenues,
  fetchProfile,
  updateProfile,
} from "../services/profileService"
import { cancelBooking } from "../apis/bookings"

const navItems = [
  { id: "profile", label: "Profile Information", icon: User },
  { id: "bookings", label: "My Bookings", icon: TicketCheck },
  { id: "favourites", label: "Favourites", icon: Heart },
]

const validSections = new Set(navItems.map((item) => item.id))

const bookingTabs = [
  { id: "upcoming", label: "Upcoming Bookings" },
  { id: "history", label: "Booking History" },
]

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
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

function SidebarNav({ activeSection, onSectionChange, onLogout }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="border-b border-border px-2 pb-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Account</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">My Profile</h1>
        </div>

        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-8 border-t border-border pt-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

function MobileNav({ activeSection, onSectionChange }) {
  return (
    <div className="lg:hidden">
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProfileInformation({ profile, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(profile)
  }, [profile])

  useEffect(() => {
    if (!successMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => setSuccessMessage(""), 4000)
    return () => window.clearTimeout(timer)
  }, [successMessage])

  const validate = () => {
    const nextErrors = {}
    const nameError = validateProfileName(form.name)
    const phoneError = validateProfilePhone(form.phone)

    if (nameError) {
      nextErrors.name = nameError
    }

    if (phoneError) {
      nextErrors.phone = phoneError
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      return
    }

    setSaving(true)
    setSaveError("")

    try {
      const updatedProfile = await updateProfile(form)
      onSave(updatedProfile)
      setEditing(false)
      setSuccessMessage("Profile updated successfully.")
    } catch (error) {
      const data = error.response?.data
      if (data?.full_name) {
        setErrors((current) => ({
          ...current,
          name: Array.isArray(data.full_name) ? data.full_name[0] : data.full_name,
        }))
      }
      if (data?.phone) {
        setErrors((current) => ({
          ...current,
          phone: Array.isArray(data.phone) ? data.phone[0] : data.phone,
        }))
      }
      if (!data?.full_name && !data?.phone) {
        setSaveError(parseAuthError(error))
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm(profile)
    setErrors({})
    setSaveError("")
    setSuccessMessage("")
    setEditing(false)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Profile Information</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground">Personal details</h2>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setSaveError("")
              setSuccessMessage("")
              setEditing(true)
            }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Full Name</span>
          <input
            type="text"
            value={form.name}
            disabled={!editing}
            maxLength={255}
            onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition disabled:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-2 text-sm text-red-700">{errors.name}</p>}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">Phone Number</span>
          <input
            type="tel"
            value={form.phone}
            disabled={!editing}
            maxLength={15}
            onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition disabled:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="10-digit mobile number"
          />
          {errors.phone && <p className="mt-2 text-sm text-red-700">{errors.phone}</p>}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-foreground">Email Address</span>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            {profile.email}
          </div>
        </label>
      </div>

      {editing && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {saveError && (
            <p className="w-full text-sm text-red-700 sm:order-first sm:basis-full">{saveError}</p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            <Check className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            <X className="h-4 w-4" />
            Cancel Changes
          </button>
        </div>
      )}
    </motion.section>
  )
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
  const upcomingStatuses = ["confirmed", "pending"]
  if (!upcomingStatuses.includes(booking.status)) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(booking.eventDate) >= today
}

function BookingCard({ booking, onCancelRequest, cancelling }) {
  const canCancel = booking.status === "pending" || booking.status === "confirmed"

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(27,36,29,0.10)]"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-foreground">{booking.venueName}</h3>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">Booking ID: {booking.id}</p>
        </div>
        <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClasses(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Event Date</p>
          <p className="mt-1 font-semibold text-foreground">{formatDate(booking.eventDate)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time Slot</p>
          <p className="mt-1 font-semibold text-foreground">
            {formatTimeRange(booking.startTime, booking.endTime)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Booked On</p>
          <p className="mt-1 font-semibold text-foreground">{formatDate(booking.bookingDate)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Amount</p>
          <p className="mt-1 font-serif text-xl font-semibold text-foreground">{formatCurrency(booking.amount)}</p>
        </div>
      </div>

      {canCancel && (
        <button
          type="button"
          onClick={() => onCancelRequest(booking)}
          disabled={cancelling}
          className="mt-5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-red-300 hover:text-red-700 disabled:opacity-60"
        >
          {cancelling ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </motion.article>
  )
}

function BookingsSection({ bookings, onCancelRequest, cancellingId }) {
  const [activeTab, setActiveTab] = useState("upcoming")

  const visibleBookings = useMemo(() => {
    return bookings.filter((booking) =>
      activeTab === "upcoming"
        ? isUpcomingBooking(booking)
        : !isUpcomingBooking(booking),
    )
  }, [activeTab, bookings])

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">My Bookings</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground">Venue reservations</h2>
          </div>
          <div className="flex rounded-full border border-border bg-background p-1">
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
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <AnimatePresence mode="popLayout">
          {visibleBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancelRequest={onCancelRequest}
              cancelling={cancellingId === booking.id}
            />
          ))}
        </AnimatePresence>

        {visibleBookings.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground">
              {activeTab === "upcoming" ? "No upcoming bookings found." : "No booking history found."}
            </h3>
          </div>
        )}
      </div>
    </motion.section>
  )
}

function FavouriteVenueCard({ venue, onRemove }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(27,36,29,0.12)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={venue.image || "/placeholder.svg"}
          alt={venue.name}
          loading="lazy"
          decoding="async"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 text-sm font-semibold text-foreground backdrop-blur-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          {venue.rating}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground">{venue.name}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {venue.location}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          From <span className="font-serif text-xl font-semibold text-foreground">{formatCurrency(venue.price)}</span> /slot
        </p>

        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
          <button
            type="button"
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            View Venue
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            Remove Favourite
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function FavouritesSection({ venues, onRemove }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Favourites</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground">Saved venues</h2>
      </div>

      {venues.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <Heart className="mx-auto h-8 w-8 text-primary" />
          <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground">No favourite venues found.</h3>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {venues.map((venue) => (
              <FavouriteVenueCard key={venue.slug} venue={venue} onRemove={() => onRemove(venue.slug)} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  )
}

function CancelBookingModal({ booking, open, onClose, onConfirm, confirming }) {
  if (!open || !booking) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground">Cancel this booking?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You are about to cancel your booking at{" "}
          <span className="font-semibold text-foreground">{booking.venueName}</span> on{" "}
          <span className="font-semibold text-foreground">{formatDate(booking.eventDate)}</span>.
        </p>
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">
          Please note that cancellations are non-refundable. The amount paid will not be returned.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={confirming}
            className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
          >
            Keep booking
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="flex-1 rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {confirming ? "Cancelling..." : "Yes, cancel booking"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function LogoutModal({ open, onCancel, onLogout }) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700">
          <LogOut className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground">Are you sure you want to logout?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You will need to sign in again to access your profile and bookings.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { logout, isAuthenticated, loading: authLoading, user, updateUser } = useAuth()
  const sectionParam = searchParams.get("section")
  const [activeSection, setActiveSection] = useState(() =>
    validSections.has(sectionParam) ? sectionParam : "profile",
  )
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [favouriteVenues, setFavouriteVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    const nextSection = validSections.has(sectionParam) ? sectionParam : "profile"
    setActiveSection((current) => (current === nextSection ? current : nextSection))
  }, [sectionParam])

  const handleSectionChange = (section) => {
    setActiveSection(section)

    if (section === "profile") {
      setSearchParams({}, { replace: true })
      return
    }

    setSearchParams({ section }, { replace: true })
  }

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return undefined
    }

    let active = true

    setLoading(true)

    Promise.all([fetchProfile(), fetchBookings(), fetchFavouriteVenues()])
      .then(([profileData, bookingData, favouriteVenueData]) => {
        if (active) {
          setProfile(profileData)
          setBookings(bookingData)
          setFavouriteVenues(favouriteVenueData)
        }
      })
      .catch((error) => console.error("Failed to load profile page:", error))
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [authLoading, isAuthenticated])

  const removeFavourite = (venueSlug) => {
    setFavouriteVenues((venues) => venues.filter((venue) => venue.slug !== venueSlug))
  }

  const handleCancelBooking = async (bookingId) => {
    setCancellingId(bookingId)
    try {
      const updatedBooking = await cancelBooking(bookingId)
      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking,
        ),
      )
      setBookingToCancel(null)
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    } finally {
      setCancellingId(null)
    }
  }

  const handleLogout = () => {
    setLogoutOpen(false)
    navigate("/", { replace: true })
    logout()
  }

  const renderContent = () => {
    if (authLoading || loading || !profile) {
      return (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
          Loading profile...
        </div>
      )
    }

    if (activeSection === "bookings") {
      return (
        <BookingsSection
          bookings={bookings}
          onCancelRequest={setBookingToCancel}
          cancellingId={cancellingId}
        />
      )
    }

    if (activeSection === "favourites") {
      return <FavouritesSection venues={favouriteVenues} onRemove={removeFavourite} />
    }

    return (
      <ProfileInformation
        profile={profile}
        onSave={(updatedProfile) => {
          setProfile(updatedProfile)
          if (user) {
            updateUser({
              ...user,
              full_name: updatedProfile.name,
              phone: updatedProfile.phone,
            })
          }
        }}
      />
    )
  }

  return (
    <>
      <main className="px-4 pt-32 pb-20 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Account</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-foreground">My Profile</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <SidebarNav
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              onLogout={() => setLogoutOpen(true)}
            />

            <div>
              <MobileNav activeSection={activeSection} onSectionChange={handleSectionChange} />
              <div className="mt-5 lg:mt-0">{renderContent()}</div>
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 lg:hidden"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>

      <CancelBookingModal
        booking={bookingToCancel}
        open={Boolean(bookingToCancel)}
        onClose={() => {
          if (!cancellingId) {
            setBookingToCancel(null)
          }
        }}
        onConfirm={() => handleCancelBooking(bookingToCancel.id)}
        confirming={Boolean(bookingToCancel && cancellingId === bookingToCancel.id)}
      />

      <LogoutModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </>
  )
}
