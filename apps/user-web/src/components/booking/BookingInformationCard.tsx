import type { BookingOut } from '../../types'
import type { VenueResponse } from '../../types' // Adjust import path based on your project structure

import { formatDateRangeTz, formatTimeTz, formatDateTz } from '../../utils'

type Props = {
  booking: BookingOut
  venue: VenueResponse
}

export function BookingInformationCard({ booking, venue }: Props) {
  const bookingType = booking.booking_type === 'full_day' ? 'Full Day' : 'Time Slot'
  const timezone = venue?.timezone || 'Asia/Kolkata'

  // Safe timezone-aware formatting
  const datesDisplay = formatDateRangeTz(booking.starts_at, booking.ends_at, timezone)
  const startTime = formatTimeTz(booking.starts_at, timezone)
  const endTime = formatTimeTz(booking.ends_at, timezone)

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-ink-800 dark:bg-ink-900 sm:p-6">
      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </span>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Booking details
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field icon={<CalendarIcon />} label="Date" value={datesDisplay} />
          <Field icon={<ClockIcon />} label="Time" value={`${startTime} – ${endTime}`} />
          <Field icon={<UsersIcon />} label="Guests" value={booking.guest_count.toString()} />
          <Field icon={<TagIcon />} label="Booking type" value={bookingType} />
          <Field icon={<CardIcon />} label="Payment" value={formatStatus(booking.payment_status)} />
          <Field icon={<PinIcon />} label="Status" value={formatStatus(booking.status)} />

          {booking.event_type && (
            <Field icon={<TagIcon />} label="Event type" value={booking.event_type} />
          )}

          {booking.balance_due_date && (
            <Field
              icon={<CalendarIcon />}
              label="Balance due"
              value={formatDateTz(booking.balance_due_date, timezone)}
            />
          )}

          {booking.owner_action_deadline && (
            <Field
              icon={<ClockIcon />}
              label="Owner action deadline"
              value={formatDateTz(booking.owner_action_deadline, timezone)}
            />
          )}
        </div>

        {booking.user_notes && (
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-ink-800 dark:bg-ink-850/40">
            <div className="mb-1.5 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              Your notes
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {booking.user_notes}
            </p>
          </div>
        )}

        {booking.owner_notes && (
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-ink-800 dark:bg-ink-850/40">
            <div className="mb-1.5 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              Venue owner notes
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {booking.owner_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* Helper Components */
type FieldProps = {
  label: string
  value: string
  icon: React.ReactNode
}

function Field({ label, value, icon }: FieldProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-ink-800 dark:text-zinc-400">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
        <div className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {value || '—'}
        </div>
      </div>
    </div>
  )
}

function formatStatus(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z"
      />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5a2 2 0 011.41.59l7 7a2 2 0 010 2.82l-5 5a2 2 0 01-2.82 0l-7-7A2 2 0 015 12V7a4 4 0 014-4z"
      />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
