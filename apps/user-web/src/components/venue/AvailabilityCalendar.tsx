import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'
import { toDateString, addMonths } from '../../utils'
import type { CalendarDay } from '../../types'

const DAY_LABELS = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const STATUS_DOT: Record<string, string | null> = {
  available: null,
  partially_booked: 'bg-amber-400',
  fully_booked: null,
  blocked: null,
  closed: null,
}

function getDaysInMonthGrid(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1)
  const startPad = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const grid: (string | null)[] = []
  for (let i = 0; i < startPad; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(toDateString(new Date(year, month, d)))
  while (grid.length % 7 !== 0) grid.push(null)
  return grid
}

// ─── Month grid ───────────────────────────────────────────────────────────────

type MonthGridProps = {
  year: number
  month: number
  dayMap: Map<string, CalendarDay>
  isLoading: boolean
  isError: boolean
  rangeStart: string | null
  rangeEnd: string | null
  hoverDate: string | null
  compact?: boolean
  onDayClick: (date: string) => void
  onDayHover: (date: string | null) => void
}

function DaySkeleton({ compact }: { compact?: boolean }) {
  const sz = compact ? 'h-8 w-8' : 'h-10 w-10'
  return <div className={`${sz} rounded-full bg-zinc-100 dark:bg-ink-800 animate-pulse`} />
}

function MonthGrid({
  year,
  month,
  dayMap,
  isLoading,
  isError,
  rangeStart,
  rangeEnd,
  hoverDate,
  compact,
  onDayClick,
  onDayHover,
}: MonthGridProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const grid = getDaysInMonthGrid(year, month)

  const btnSize = compact ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'

  if (isError) {
    return <p className="text-xs text-red-500 text-center py-4">Failed to load availability.</p>
  }

  return (
    <>
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className={`text-center ${compact ? 'text-[10px]' : 'text-xs'} font-medium text-zinc-400 dark:text-zinc-500 py-1`}
          >
            {compact ? label[0] : label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((dateStr, i) => {
          if (!dateStr) return <div key={`pad-${i}`} className="h-10" />

          if (isLoading) {
            return (
              <div key={dateStr} className="flex items-center justify-center py-0.5">
                <DaySkeleton compact={compact} />
              </div>
            )
          }

          const calDay = dayMap.get(dateStr)
          const dateObj = new Date(dateStr + 'T00:00:00')
          const isPast = dateObj < today
          const isDisabled =
            isPast ||
            !calDay ||
            !calDay.is_bookable ||
            calDay.status === 'fully_booked' ||
            calDay.status === 'blocked' ||
            calDay.status === 'closed'

          const isStart = dateStr === rangeStart
          const isEnd = dateStr === rangeEnd
          const isSingleDay = rangeStart !== null && rangeStart === rangeEnd
          const effectiveEnd =
            rangeEnd ?? (hoverDate && rangeStart && hoverDate > rangeStart ? hoverDate : null)
          const isInRange = !!(
            rangeStart &&
            effectiveEnd &&
            dateStr > rangeStart &&
            dateStr < effectiveEnd
          )
          const isHovering =
            !rangeEnd && hoverDate === dateStr && rangeStart && dateStr > rangeStart
          const hasRange = !!(rangeStart && effectiveEnd && rangeStart !== effectiveEnd)

          const dot = calDay ? STATUS_DOT[calDay.status] : null

          // Range background strip (behind the circle)
          let stripClass = 'absolute inset-y-0 hidden '
          if (!isSingleDay) {
            if (isInRange) stripClass = 'absolute inset-y-0 inset-x-0 bg-brand-light dark:bg-brand/20 '
            else if (isStart && hasRange)
              stripClass = 'absolute inset-y-0 left-1/2 right-0 bg-brand-light dark:bg-brand/20 '
            else if ((isEnd || isHovering) && hasRange)
              stripClass = 'absolute inset-y-0 left-0 right-1/2 bg-brand-light dark:bg-brand/20 '
          }

          // Circle button
          let btnClass = `relative z-10 flex flex-col items-center justify-center ${btnSize} rounded-full font-medium transition-colors `
          if (isStart || isEnd) {
            btnClass += 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
          } else if (isInRange || isHovering) {
            btnClass += 'text-zinc-800 font-semibold dark:text-zinc-200'
          } else if (isDisabled) {
            btnClass += 'text-zinc-300 cursor-not-allowed line-through dark:text-zinc-700'
          } else {
            btnClass +=
              calDay?.status === 'partially_booked'
                ? 'text-zinc-700 hover:bg-amber-50 cursor-pointer dark:text-zinc-300 dark:hover:bg-amber-950/30'
                : 'text-zinc-700 hover:bg-brand-light cursor-pointer dark:text-zinc-300 dark:hover:bg-brand/15'
          }

          return (
            <div
              key={dateStr}
              className="relative flex items-center justify-center py-0.5"
              onMouseEnter={() => !isDisabled && onDayHover(dateStr)}
              onMouseLeave={() => onDayHover(null)}
            >
              {/* Range background strip */}
              <div className={stripClass} />

              {/* Day button */}
              <button
                onClick={() => !isDisabled && onDayClick(dateStr)}
                disabled={isDisabled}
                className={btnClass}
                aria-label={dateStr}
                aria-pressed={isStart || isEnd}
              >
                {new Date(dateStr + 'T00:00:00').getDate()}
                {dot && !isStart && !isEnd && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${dot}`}
                  />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex items-center gap-4">
      <LegendItem color="bg-zinc-900 dark:bg-zinc-100" label="Selected" />
      <LegendItem color="bg-brand-light dark:bg-brand/20" label="Range" />
      <LegendItem dot="bg-amber-400" label="Partial" />
      <LegendItem color="bg-zinc-200 dark:bg-ink-700" label="Unavailable" />
    </div>
  )
}

function LegendItem({ color, dot, label }: { color?: string; dot?: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
      {dot ? (
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        </span>
      ) : (
        <span className={`h-3.5 w-3.5 rounded-full ${color}`} />
      )}
      {label}
    </span>
  )
}

// ─── Single-month calendar (used as compact fallback) ─────────────────────────

type SingleProps = {
  venueId: string
  selectedDate: string | null
  onDateSelect: (date: string) => void
}

export function AvailabilityCalendar({ venueId, selectedDate, onDateSelect }: SingleProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const year = viewDate.getFullYear(),
    month = viewDate.getMonth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['calendar', venueId, year, month],
    queryFn: () =>
      venueEndpoints(createClient()).getCalendar(venueId, {
        start_date: toDateString(viewDate),
        end_date: toDateString(new Date(year, month + 1, 0)),
        booking_type: 'full_day',
      }),
    staleTime: 5 * 60 * 1000,
  })

  const dayMap = new Map<string, CalendarDay>()
  data?.days.forEach((d: CalendarDay) => dayMap.set(d.date, d))

  const canGoPrev =
    year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setViewDate(addMonths(viewDate, -1))}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed dark:hover:text-zinc-200 dark:hover:bg-ink-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="text-sm font-semibold">
          {viewDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-ink-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <MonthGrid
        year={year}
        month={month}
        dayMap={dayMap}
        isLoading={isLoading}
        isError={isError}
        rangeStart={selectedDate}
        rangeEnd={selectedDate}
        hoverDate={null}
        compact
        onDayClick={onDateSelect}
        onDayHover={() => {}}
      />
      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-ink-800">
        <Legend />
      </div>
    </div>
  )
}

// ─── Double-month calendar with range selection ───────────────────────────────

type DoubleProps = {
  venueId: string
  bookingType: string
  startDate: string | null
  endDate: string | null
  onRangeChange: (start: string | null, end: string | null) => void
  onClear: () => void
}

function fetchMonth(venueId: string, year: number, month: number, bookingType: string) {
  const start = toDateString(new Date(year, month, 1))
  const end = toDateString(new Date(year, month + 1, 0))
  return venueEndpoints(createClient()).getCalendar(venueId, {
    start_date: start,
    end_date: end,
    booking_type: bookingType,
  })
}

export function AvailabilityCalendarDouble({
  venueId,
  bookingType,
  startDate,
  endDate,
  onRangeChange,
  onClear,
}: DoubleProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [hoverDate, setHoverDate] = useState<string | null>(null)

  const year1 = viewDate.getFullYear(),
    month1 = viewDate.getMonth()
  const next = addMonths(viewDate, 1)
  const year2 = next.getFullYear(),
    month2 = next.getMonth()

  const q1 = useQuery({
    queryKey: ['calendar', venueId, year1, month1, bookingType],
    queryFn: () => fetchMonth(venueId, year1, month1, bookingType),
    staleTime: 5 * 60 * 1000,
  })
  const q2 = useQuery({
    queryKey: ['calendar', venueId, year2, month2, bookingType],
    queryFn: () => fetchMonth(venueId, year2, month2, bookingType),
    staleTime: 5 * 60 * 1000,
  })

  const map1 = new Map<string, CalendarDay>()
  q1.data?.days.forEach((d: CalendarDay) => map1.set(d.date, d))
  const map2 = new Map<string, CalendarDay>()
  q2.data?.days.forEach((d: CalendarDay) => map2.set(d.date, d))

  const canGoPrev =
    year1 > today.getFullYear() || (year1 === today.getFullYear() && month1 > today.getMonth())

  // Inside AvailabilityCalendarDouble component
  function handleDayClick(date: string) {
    if (!startDate) {
      onRangeChange(date, null)
      return
    }

    if (date === startDate) {
      // Explicit single-day
      onRangeChange(date, date)
      return
    }

    if (!endDate) {
      // Set end - enforce order
      const newStart = date < startDate ? date : startDate
      const newEnd = date < startDate ? startDate : date
      onRangeChange(newStart, newEnd)
      return
    }

    // Both already set → start fresh selection
    onRangeChange(date, null)
  }

  const label1 = viewDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })
  const label2 = next.toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  const sharedGridProps = {
    rangeStart: startDate,
    rangeEnd: endDate,
    hoverDate,
    onDayHover: setHoverDate,
  }

  return (
    <div className="select-none">
      {/* ── Two months side by side ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {/* Month 1 */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={() => setViewDate(addMonths(viewDate, -1))}
              disabled={!canGoPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:hover:bg-ink-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label1}</span>
            <div className="h-8 w-8" />
          </div>
          <MonthGrid
            year={year1}
            month={month1}
            dayMap={map1}
            isLoading={q1.isLoading}
            isError={q1.isError}
            onDayClick={handleDayClick}
            {...sharedGridProps}
          />
        </div>

        {/* Month 2 */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div className="h-8 w-8" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label2}</span>
            <button
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors dark:hover:bg-ink-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <MonthGrid
            year={year2}
            month={month2}
            dayMap={map2}
            isLoading={q2.isLoading}
            isError={q2.isError}
            onDayClick={handleDayClick}
            {...sharedGridProps}
          />
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-ink-800">
        <Legend />
        {(startDate || endDate) && (
          <button
            onClick={onClear}
            className="text-sm font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-900 transition-colors dark:hover:text-zinc-100"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  )
}
