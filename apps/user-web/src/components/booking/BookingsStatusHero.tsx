import type { BookingOut } from '../../types'

type Props = {
  booking: BookingOut
}

const STATUS_META = {
  requested: {
    label: 'Requested',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    description: 'Your booking request has been submitted and is awaiting venue approval.',
  },

  payment_pending: {
    label: 'Awaiting Payment',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    description:
      'Your slot is reserved. Complete payment before the timer runs out to confirm your booking.',
  },

  owner_accepted: {
    label: 'Accepted',
    color: 'bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary',
    description:
      'The venue owner has accepted your booking. Complete payment to secure your reservation.',
  },

  confirmed: {
    label: 'Confirmed',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    description: 'Your venue booking has been confirmed.',
  },

  completed: {
    label: 'Completed',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    description: 'This event has been completed.',
  },

  hold_expired: {
    label: 'Expired',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-400',
    description: 'The booking hold period expired before payment was completed.',
  },

  request_expired: {
    label: 'Expired',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-400',
    description: 'The booking request expired before owner action.',
  },

  owner_rejected: {
    label: 'Rejected',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-400',
    description: 'The venue owner declined this booking request.',
  },

  user_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    description: 'This booking was cancelled.',
  },

  admin_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    description: 'This booking was cancelled.',
  },

  conflict_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    description: 'This booking was cancelled due to a scheduling conflict.',
  },

  balance_overdue_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    description: 'The booking was cancelled because the balance payment became overdue.',
  },
} as const

function EventNotice({
  tone,
  title,
  description,
}: {
  tone: 'success' | 'danger'
  title: string
  description: string
}) {
  const palette =
    tone === 'success'
      ? {
          border: 'border-emerald-100 dark:border-emerald-900/50',
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          title: 'text-emerald-800 dark:text-emerald-300',
          body: 'text-emerald-700 dark:text-emerald-400',
        }
      : {
          border: 'border-red-100 dark:border-red-900/50',
          bg: 'bg-red-50 dark:bg-red-950/30',
          title: 'text-red-800 dark:text-red-300',
          body: 'text-red-700 dark:text-red-400',
        }

  return (
    <div className={`rounded-xl border ${palette.border} ${palette.bg} px-4 py-3`}>
      <div className={`text-sm font-medium ${palette.title}`}>{title}</div>
      <div className={`mt-1 text-xs ${palette.body}`}>{description}</div>
    </div>
  )
}

export function BookingStatusHero({ booking }: Props) {
  const meta = STATUS_META[booking.status as keyof typeof STATUS_META] ?? STATUS_META.requested

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="space-y-6">
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{meta.label}</h1>
          <p className="mt-2 max-w-2xl text-zinc-500">{meta.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Booking ID
            </div>
            <div className="mt-1 break-all text-sm font-medium text-zinc-900 dark:text-zinc-100">{booking.id}</div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Payment Status
            </div>
            <div className="mt-1 text-sm font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {booking.payment_status.replace(/_/g, ' ')}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Venue ID
            </div>
            <div className="mt-1 break-all text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {booking.venue_id}
            </div>
          </div>
        </div>

        {booking.confirmed_at && (
          <EventNotice
            tone="success"
            title="Booking confirmed"
            description={`Confirmation recorded on ${new Date(booking.confirmed_at).toLocaleString('en-IN')}`}
          />
        )}

        {booking.cancelled_at && (
          <EventNotice
            tone="danger"
            title="Booking cancelled"
            description={`Cancellation recorded on ${new Date(booking.cancelled_at).toLocaleString('en-IN')}`}
          />
        )}
      </div>
    </div>
  )
}
