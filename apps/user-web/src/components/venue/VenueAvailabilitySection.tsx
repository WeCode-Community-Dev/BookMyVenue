import { useEffect, useState } from 'react'
import { AvailabilityCalendarDouble } from './AvailabilityCalendar'
import { TimeSlotPicker } from './TimeSlotPicker'
import type { VenueResponse, AvailabilityResponse, BookingType } from '../../types'
import { formatDate } from '../../utils'
import { createClient, venueEndpoints } from '@venue404/api-client'

type Props = {
  venue: VenueResponse
  bookingType: BookingType
  startDate: string | null
  endDate: string | null
  selectedStart: string | null
  selectedEnd: string | null
  availability: AvailabilityResponse | undefined
  availLoading: boolean
  availError: boolean
  onRangeChange: (start: string | null, end: string | null) => void
  onSlotSelect: (start: string, end: string | null) => void
  onClear: () => void
  onClearSlot: () => void
  scrollTrigger?: number // increment this any time you want a flash
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function VenueAvailabilitySection({
  venue,
  bookingType,
  startDate,
  endDate,
  selectedStart,
  selectedEnd,
  availability,
  availLoading,
  availError,
  onRangeChange,
  onSlotSelect,
  onClear,
  onClearSlot,
  scrollTrigger
}: Props) {
  const startLabel = startDate ? formatDate(startDate + 'T00:00:00') : null
  const endLabel = endDate ? formatDate(endDate + 'T00:00:00') : null
  const days = startDate && endDate ? daysBetween(startDate, endDate) + 1 : null
  const [justArrived, setJustArrived] = useState(false)
  const [peakMinutes, setPeakMinutes] = useState<Set<number>>(new Set())

  // Best-effort: preview the full open-close window for the selected date so
  // slots priced above the base rate by an active rule can be flagged "peak".
  useEffect(() => {
    if (bookingType !== 'time_slot' || !startDate || !venue.open_time || !venue.close_time) {
      setPeakMinutes(new Set())
      return
    }
    let cancelled = false
    async function loadPeakSlots() {
      try {
        const client = createClient()
        const quote = await venueEndpoints(client).getQuote(venue.id, {
          starts_at: `${startDate}T${venue.open_time}`,
          ends_at: `${startDate}T${venue.close_time}`,
          booking_type: 'time_slot',
        })
        if (cancelled) return
        const peaks = new Set<number>()
        for (const item of quote.breakdown ?? []) {
          if (!item.start_time || item.final_paise <= item.base_paise) continue
          const [h, m] = item.start_time.slice(0, 5).split(':').map(Number)
          peaks.add(h * 60 + m)
        }
        setPeakMinutes(peaks)
      } catch {
        if (!cancelled) setPeakMinutes(new Set())
      }
    }
    loadPeakSlots()
    return () => {
      cancelled = true
    }
  }, [venue.id, venue.open_time, venue.close_time, startDate, bookingType])

  const headerText =
    startDate && endDate && bookingType === 'full_day'
      ? days === 1
        ? `1 day in ${venue.city}`
        : `${days} days in ${venue.city}`
      : startDate && bookingType === 'full_day'
        ? 'Select end date'
        : startDate && bookingType === 'time_slot'
          ? 'Select your time'
          : bookingType === 'full_day'
            ? 'Select event dates'
            : 'Select event date'

  const subText =
    startDate && endDate && bookingType === 'full_day'
      ? `${startLabel} — ${endLabel}`
      : startDate
        ? (startLabel ?? undefined)
        : undefined

  // Detect arrival via the URL hash isn't reliable here since we use
  // scrollIntoView, not hash navigation — instead, flash briefly whenever
  // bookingType changes (the main trigger for scrolling here).
  useEffect(() => {
    setJustArrived(true)
    const t = setTimeout(() => setJustArrived(false), 1200)
    return () => clearTimeout(t)
  }, [bookingType, scrollTrigger])

  return (
    <div
      className={`transition-shadow duration-700 rounded-2xl ${justArrived ? 'ring-2 ring-brand/30' : ''}`}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">{headerText}</h2>
        {subText && <p className="mt-1 text-sm text-zinc-500">{subText}</p>}
        {!startDate && bookingType === 'full_day' && (
          <p className="mt-1 text-sm text-zinc-400">Click a start date, then click an end date</p>
        )}
        {startDate && !endDate && bookingType === 'full_day' && (
          <p className="mt-1 text-sm text-zinc-400">
            Click the same day for a 1-day event or select an end date for multi-day
          </p>
        )}
      </div>

      {/* ── Double-month calendar ─────────────────────────── */}
      <AvailabilityCalendarDouble
        venueId={venue.id}
        startDate={startDate}
        endDate={endDate}
        onRangeChange={onRangeChange}
        onClear={onClear}
      />

      {/* ── Time slot picker (time_slot only) ────────────── */}
      {bookingType === 'time_slot' && startDate && (
        <div className="mt-8 border-t border-zinc-100 pt-8">
          <h3 className="mb-4 text-base font-semibold text-zinc-900">Select your time</h3>

          {availLoading && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-10 bg-zinc-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {availError && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              Failed to load time slots. Please try again.
            </div>
          )}

          {availability && !availLoading && (
            <TimeSlotPicker
              date={startDate}
              availability={availability}
              venueConfig={venue}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              onSelect={onSlotSelect}
              onClear={onClearSlot}
              peakMinutes={peakMinutes}
            />
          )}
        </div>
      )}
    </div>
  )
}
