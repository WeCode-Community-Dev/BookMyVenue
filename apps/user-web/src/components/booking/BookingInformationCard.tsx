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
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="space-y-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Booking Details
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Booking Type" value={bookingType} />
          <Field label="Guests" value={booking.guest_count.toString()} />

          {/* Improved Date & Time Display */}
          <Field label="Event Dates" value={datesDisplay} />
          <Field label="Times" value={`${startTime} — ${endTime}`} />

          <Field label="Booking Status" value={formatStatus(booking.status)} />

          {booking.event_type && <Field label="Event Type" value={booking.event_type} />}

          <Field label="Payment Status" value={formatStatus(booking.payment_status)} />

          {booking.balance_due_date && (
            <Field
              label="Balance Due Date"
              value={formatDateTz(booking.balance_due_date, timezone)}
            />
          )}

          {booking.owner_action_deadline && (
            <Field
              label="Owner Action Deadline"
              value={formatDateTz(booking.owner_action_deadline, timezone)}
            />
          )}
        </div>

        {booking.user_notes && (
          <div className="border-t border-zinc-100 pt-6 dark:border-ink-800">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              User Notes
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {booking.user_notes}
            </p>
          </div>
        )}

        {booking.owner_notes && (
          <div className="border-t border-zinc-100 pt-6 dark:border-ink-800">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Venue Owner Notes
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
}

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{value || '—'}</div>
    </div>
  )
}

function formatStatus(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
