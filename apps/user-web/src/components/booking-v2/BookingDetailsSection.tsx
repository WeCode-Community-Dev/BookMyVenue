import type { BookingOut, VenueResponse } from '../../types'
import { formatDateTz, formatTimeTz } from '../../utils'

type Props = {
  booking: BookingOut
  venue: VenueResponse
}

export function BookingDetailsSection({ booking, venue }: Props) {
  const timezone = venue.timezone || 'Asia/Kolkata'

  return (
    <section className="border-t border-zinc-200 py-8 dark:border-ink-800">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Booking Details
      </h2>

      <dl className="divide-y divide-zinc-200 dark:divide-ink-800">
        <DefinitionRow
          label="Date"
          value={formatDateTz(booking.starts_at, timezone)}
        />

        <DefinitionRow
          label="Time"
          value={`${formatTimeTz(booking.starts_at, timezone)} – ${formatTimeTz(
            booking.ends_at,
            timezone
          )}`}
        />

        <DefinitionRow label="Guests" value={booking.guest_count.toLocaleString()} />

        <DefinitionRow
          label="Booking Type"
          value={booking.booking_type === 'full_day' ? 'Full Day' : 'Time Slot'}
        />

        <DefinitionRow
          label="Payment Status"
          value={formatStatus(booking.payment_status)}
          status="success"
        />

        <DefinitionRow label="Booking Status" value={formatStatus(booking.status)} />

        {booking.event_type && <DefinitionRow label="Event Type" value={booking.event_type} />}

        {booking.balance_due_date && (
          <DefinitionRow label="Balance Due" value={formatDateTz(booking.balance_due_date, timezone)} />
        )}

        {booking.owner_action_deadline && (
          <DefinitionRow
            label="Owner Action Deadline"
            value={formatDateTz(booking.owner_action_deadline, timezone)}
          />
        )}
      </dl>

      {(booking.user_notes || booking.owner_notes) && (
        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-ink-800">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Notes</h3>

          {booking.user_notes && <NoteSection title="Customer Notes" body={booking.user_notes} />}

          {booking.owner_notes && <NoteSection title="Venue Notes" body={booking.owner_notes} />}
        </div>
      )}
    </section>
  )
}

function DefinitionRow({
  label,
  value,
  status,
}: {
  label: string
  value: React.ReactNode
  status?: 'success'
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-baseline gap-4 py-2.5">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd
        className={`font-medium ${
          status === 'success'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-900 dark:text-zinc-100'
        }`}
      >
        {value || '—'}
      </dd>
    </div>
  )
}

function NoteSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="mb-1.5 text-sm font-medium text-zinc-500">{title}</h4>
      <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {body}
      </p>
    </div>
  )
}

function formatStatus(value: string) {
  return value
    .split('_')
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' ')
}