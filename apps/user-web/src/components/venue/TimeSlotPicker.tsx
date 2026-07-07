import { useMemo, useCallback } from 'react'
import { formatTime } from '../../utils'
import type { AvailabilityResponse, VenueResponse } from '../../types'

type VenueConfig = Pick<
  VenueResponse,
  'slot_interval_minutes' | 'min_booking_duration_minutes' | 'max_booking_duration_minutes'
>

type Props = {
  date: string
  availability: AvailabilityResponse
  venueConfig: VenueConfig
  selectedStart: string | null
  selectedEnd: string | null
  onSelect: (start: string, end: string | null) => void
  onClear: () => void
  /** Minute-of-day values (0-1439) priced above the venue's base rate for this date. */
  peakMinutes?: Set<number>
}

function toMinutes(timeStr: string): number {
  const t = timeStr.length <= 8 ? timeStr : timeStr.slice(11, 19)
  const [h, m] = t.split(':').map(Number)
  return (h * 60 + m) % 1440
}

function minutesToISO(date: string, minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${date}T${h}:${m}:00`
}

function durationLabel(startMin: number, endMin: number): string {
  const diff = endMin - startMin
  const h = Math.floor(diff / 60)
  const m = diff % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function TimeSlotPicker({
  date,
  availability,
  venueConfig,
  selectedStart,
  selectedEnd,
  onSelect,
  onClear,
  peakMinutes,
}: Props) {
  const { operating_window, blocked_slots = [] } = availability
  const { slot_interval_minutes, min_booking_duration_minutes, max_booking_duration_minutes } =
    venueConfig

  // Unified list of all possible time points (start + potential ends)
  const allTimePoints = useMemo<number[]>(() => {
    if (!operating_window.is_available || !operating_window.opens_at || !operating_window.closes_at)
      return []
    const openMin = toMinutes(operating_window.opens_at)
    const closeMin = toMinutes(operating_window.closes_at)
    const points: number[] = []
    for (let m = openMin; m <= closeMin; m += slot_interval_minutes) {
      points.push(m)
    }
    return points
  }, [operating_window, slot_interval_minutes])

  const blockedRanges = useMemo(
    () => blocked_slots.map((s) => ({ start: toMinutes(s.starts_at), end: toMinutes(s.ends_at) })),
    [blocked_slots]
  )

  const isRangeBlocked = useCallback(
    (startMin: number, endMin: number): boolean => {
      return blockedRanges.some((r) => startMin < r.end && endMin > r.start)
    },
    [blockedRanges]
  )

  const selectedStartMin = selectedStart ? toMinutes(selectedStart) : null
  const selectedEndMin = selectedEnd ? toMinutes(selectedEnd) : null
  const closeMin = operating_window.closes_at ? toMinutes(operating_window.closes_at) : 0

  const validEndSlots = useMemo<Set<number>>(() => {
    if (selectedStartMin == null) return new Set()
    const valid = new Set<number>()
    let m = selectedStartMin + min_booking_duration_minutes
    while (m <= selectedStartMin + max_booking_duration_minutes && m <= closeMin) {
      if (!isRangeBlocked(selectedStartMin, m)) valid.add(m)
      m += slot_interval_minutes
    }
    return valid
  }, [
    selectedStartMin,
    min_booking_duration_minutes,
    max_booking_duration_minutes,
    closeMin,
    slot_interval_minutes,
    isRangeBlocked,
  ])

const handleSlotClick = useCallback(
  (minutes: number) => {
    if (selectedStartMin == null) {
      onSelect(minutesToISO(date, minutes), null)
      return
    }
    if (minutes <= selectedStartMin) {
      // FIX: don't let a blocked slot become the new start via restart
      if (isRangeBlocked(minutes, minutes + min_booking_duration_minutes)) return
      onSelect(minutesToISO(date, minutes), null)
      return
    }
    if (validEndSlots.has(minutes)) {
      onSelect(minutesToISO(date, selectedStartMin), minutesToISO(date, minutes))
    }
  },
  [selectedStartMin, validEndSlots, date, onSelect, isRangeBlocked, min_booking_duration_minutes]
)

  if (!operating_window.is_available) {
    return (
      <p className="text-sm text-zinc-400 italic text-center py-4">Venue is closed on this date.</p>
    )
  }
  if (allTimePoints.length === 0) {
    return (
      <p className="text-sm text-zinc-400 italic text-center py-4">
        No available time slots for this date.
      </p>
    )
  }

  const isSelectingEnd = selectedStartMin != null && selectedEndMin == null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          {isSelectingEnd ? 'Select end time' : 'Select start time'}
        </p>
        {selectedStartMin != null && (
          <button
            onClick={onClear}
            className="text-xs text-brand hover:text-brand-hover transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {isSelectingEnd && (
        <div className="mb-3 rounded-lg bg-brand-light px-3 py-2 text-xs text-brand dark:bg-brand/15">
          Start: <strong>{formatTime(selectedStart!)}</strong> — Tap a valid end time
        </div>
      )}

      {selectedStartMin != null && selectedEndMin != null && (
        <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500 bg-brand-light rounded-lg px-3 py-2 dark:bg-brand/15">
          <svg
            className="h-3.5 w-3.5 text-brand-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {formatTime(selectedStart!)} – {formatTime(selectedEnd!)} ·{' '}
            <strong className="text-brand">
              {durationLabel(selectedStartMin, selectedEndMin)}
            </strong>
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1.5">
        {allTimePoints.map((minutes) => {
          const slotISO = minutesToISO(date, minutes)
          const isStart = selectedStartMin === minutes
          const isEnd = selectedEndMin === minutes
          const isInRange =
            selectedStartMin != null &&
            selectedEndMin != null &&
            minutes > selectedStartMin &&
            minutes < selectedEndMin

          let isDisabled = false
          if (selectedStartMin == null) {
            isDisabled = isRangeBlocked(minutes, minutes + min_booking_duration_minutes)
          } else if (selectedEndMin == null) {
            if (minutes <= selectedStartMin) {
              // FIX: restarting the selection still needs the blocked check
              isDisabled = isRangeBlocked(minutes, minutes + min_booking_duration_minutes)
            } else {
              isDisabled = !validEndSlots.has(minutes)
            }
          } else {
            isDisabled = true
          }

          let cls = 'px-3 py-2.5 rounded-xl text-sm font-medium text-center transition-all border '
          if (isStart || isEnd) {
            cls += 'bg-zinc-900 text-white border-zinc-900 shadow-sm dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
          } else if (isInRange) {
            cls += 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900'
          } else if (isDisabled) {
            cls += 'bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed dark:bg-ink-900 dark:text-zinc-700 dark:border-ink-800'
          } else {
            cls += 'hover:bg-blue-50 hover:border-blue-200 border-zinc-200 active:bg-blue-100 dark:border-ink-700 dark:text-zinc-300 dark:hover:bg-blue-950/40 dark:hover:border-blue-900'
          }

          const isPeak = peakMinutes?.has(minutes) ?? false

          return (
            <button
              key={slotISO}
              onClick={() => !isDisabled && handleSlotClick(minutes)}
              disabled={isDisabled}
              className={`relative ${cls}`}
              title={isPeak ? 'Peak pricing applies to this slot' : undefined}
            >
              {formatTime(slotISO)}
              {isPeak && !isDisabled && !isStart && !isEnd && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          )
        })}
      </div>

      {peakMinutes && peakMinutes.size > 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Peak pricing applies to marked slots
        </p>
      )}

      <p className="mt-2 text-xs text-zinc-400">
        Min {min_booking_duration_minutes / 60}h · Max {max_booking_duration_minutes / 60}h
      </p>
    </div>
  )
}
