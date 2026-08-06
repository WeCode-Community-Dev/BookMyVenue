import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, MapPin, X } from "lucide-react"
import {
  fetchVenueAvailability,
  verifySlotAvailability,
} from "../../apis/venueSchedules"
import { formatVenuePrice } from "../../apis/venues"
import { useAuth } from "../../contexts/AuthContext"
import { useAuthModal } from "../../contexts/AuthModalContext"
import BookingConfirmationContent from "./BookingConfirmationDialog"

function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatTimeLabel(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hour = hours % 12 || 12

  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`
}

function formatSlotTimeRange(startTime, endTime) {
  return `${formatTimeLabel(startTime)} - ${formatTimeLabel(endTime)}`
}

function getSlotLabel(slot) {
  return slot.name || formatSlotTimeRange(slot.startTime, slot.endTime)
}

export default function VenueBookingModal({ open, onClose, venue }) {
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [step, setStep] = useState("select")
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()))
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [availabilityError, setAvailabilityError] = useState("")
  const [bookError, setBookError] = useState("")

  const bookingDateRange = useMemo(() => {
    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 90)

    return {
      min: toDateInputValue(today),
      max: toDateInputValue(maxDate),
    }
  }, [])

  const selectedSlot = useMemo(
    () =>
      slots.find((slot) => String(slot.id) === String(selectedSlotId)) ?? null,
    [slots, selectedSlotId],
  )

  const loadAvailability = useCallback(async () => {
    if (!venue?.slug || !selectedDate) return

    setLoading(true)
    setAvailabilityError("")

    try {
      const data = await fetchVenueAvailability(venue.slug, selectedDate)
      const availableSlots = (data.slots ?? []).filter(
        (slot) => slot.status === "AVAILABLE",
      )
      setSlots(availableSlots)
      setSelectedSlotId((current) =>
        current != null &&
        availableSlots.some((slot) => String(slot.id) === String(current))
          ? current
          : null,
      )
    } catch (fetchError) {
      console.error("Failed to fetch availability:", fetchError)
      setSlots([])
      setSelectedSlotId(null)
      setAvailabilityError("Could not load available slots. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedDate, venue?.slug])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return
      if (step === "confirm") {
        setStep("select")
        return
      }
      onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose, step])

  useEffect(() => {
    if (!open) return
    loadAvailability()
  }, [open, loadAvailability])

  useEffect(() => {
    if (!open) {
      setStep("select")
      setSelectedDate(toDateInputValue(new Date()))
      setSelectedSlotId(null)
      setSlots([])
      setAvailabilityError("")
      setBookError("")
      setCheckingAvailability(false)
    }
  }, [open])

  const openConfirmationAfterAuth = () => {
    setStep("confirm")
  }

  const handleBookNow = async () => {
    if (!selectedSlotId) return

    setCheckingAvailability(true)
    setBookError("")

    try {
      const result = await verifySlotAvailability(
        venue.slug,
        selectedDate,
        selectedSlotId,
      )

      if (!result.available) {
        setBookError(result.message)
        await loadAvailability()
        return
      }

      if (!isAuthenticated) {
        openAuthModal({
          message: "Sign in to confirm your booking.",
          onSuccess: openConfirmationAfterAuth,
        })
        return
      }

      openConfirmationAfterAuth()
    } catch (verifyError) {
      console.error("Failed to verify slot availability:", verifyError)
      setBookError("Could not verify availability. Please try again.")
      await loadAvailability()
    } finally {
      setCheckingAvailability(false)
    }
  }

  const selectSlot = (slotId) => {
    setBookError("")
    setSelectedSlotId((current) => (current === slotId ? null : slotId))
  }

  if (!open || !venue) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 px-4 py-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="relative max-h-[92vh] w-full min-h-[580px] max-w-3xl overflow-y-auto rounded-2xl bg-card shadow-2xl md:min-h-[620px]"
      >
        <div className="grid min-h-[580px] md:min-h-[620px] md:grid-cols-[0.95fr_1.4fr]">
          <div className="relative min-h-56 bg-muted md:min-h-[620px]">
            <img
              src={venue.image}
              alt={venue.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                <CalendarDays size={14} />
                {step === "confirm" ? "Booking confirmation" : "Instant booking"}
              </p>
              <h2 className="font-serif text-3xl font-bold">{venue.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/85">
                <MapPin size={16} />
                {venue.location}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-background/90 p-2 text-foreground shadow-sm transition hover:bg-background"
              aria-label="Close booking popup"
            >
              <X size={20} />
            </button>

            {step === "confirm" && selectedSlot ? (
              <BookingConfirmationContent
                venue={venue}
                selectedSchedule={selectedSlot}
                bookingDate={selectedDate}
                onCancel={() => setStep("select")}
                onBookingConfirmed={onClose}
              />
            ) : (
              <>
                <div className="mb-6 pr-8">
                  <p className="text-sm font-semibold text-primary">Choose your date and slot</p>
                  <h3 className="mt-1 font-serif text-2xl font-bold">Book this venue</h3>
                </div>

                <label className="mb-2 block text-sm font-semibold" htmlFor="booking-date">
                  Event date
                </label>
                <div className="relative mb-6">
                  <CalendarDays
                    size={20}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                  />
                  <input
                    id="booking-date"
                    type="date"
                    value={selectedDate}
                    min={bookingDateRange.min}
                    max={bookingDateRange.max}
                    onChange={(event) => {
                      setSelectedDate(event.target.value)
                      setSelectedSlotId(null)
                      setBookError("")
                    }}
                    className="w-full rounded-lg border border-border bg-background py-3 pl-12 pr-4 font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">Available slots</p>
                    {selectedSlot && (
                      <span className="text-xs font-medium text-muted-foreground">
                        1 selected
                      </span>
                    )}
                  </div>

                  <div className="h-64 overflow-y-auto pr-1">
                    {loading ? (
                      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
                        Loading available slots...
                      </div>
                    ) : availabilityError ? (
                      <div className="flex h-full flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-center">
                        <p className="text-sm text-destructive">{availabilityError}</p>
                        <button
                          type="button"
                          onClick={loadAvailability}
                          className="mt-3 text-sm font-semibold text-primary hover:underline"
                        >
                          Retry
                        </button>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
                        No slots available for this date.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {slots.map((slot) => {
                          const isSelected = String(selectedSlotId) === String(slot.id)

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => selectSlot(slot.id)}
                              className={`flex items-center justify-between rounded-lg border p-4 text-left transition ${
                                isSelected
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                                  : "border-border bg-background hover:border-primary/60"
                              }`}
                            >
                              <span>
                                <span className="block font-semibold">{getSlotLabel(slot)}</span>
                                <span className="mt-1 block text-sm text-muted-foreground">
                                  {formatSlotTimeRange(slot.startTime, slot.endTime)}
                                </span>
                              </span>
                              <span className="text-right">
                                <span className="block font-serif text-lg font-bold text-primary">
                                  {formatVenuePrice(slot.price)}
                                </span>
                                <span className="text-xs text-muted-foreground">venue rental</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6 rounded-lg border border-border bg-secondary/60 p-4">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Selected slot</span>
                    <span className="text-right text-sm font-semibold">
                      {selectedSlot ? getSlotLabel(selectedSlot) : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-serif text-2xl font-bold text-primary">
                      {selectedSlot ? formatVenuePrice(selectedSlot.price) : "—"}
                    </span>
                  </div>
                </div>

                {bookError && (
                  <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {bookError}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.button
                    whileHover={{ scale: checkingAvailability ? 1 : 1.02 }}
                    whileTap={{ scale: checkingAvailability ? 1 : 0.98 }}
                    disabled={!selectedSlot || checkingAvailability}
                    onClick={handleBookNow}
                    className="flex-1 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {checkingAvailability ? "Checking availability..." : "Book Now"}
                  </motion.button>
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-border px-5 py-3 font-semibold text-foreground transition hover:bg-muted"
                  >
                    Keep Browsing
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
