import type { BookingOut } from '../../types'

type Props = {
  booking: BookingOut
}

const STATUS_META: Record<string, { label: string; description: string }> = {
  requested: {
    label: 'Booking Requested',
    description: 'Your booking request has been submitted and is waiting for venue approval.',
  },
  owner_accepted: {
    label: 'Booking Accepted',
    description: 'The venue owner has accepted your booking. Complete payment to secure your reservation.',
  },
  payment_pending: {
    label: 'Awaiting Payment',
    description:
      'Your slot is reserved. Complete payment before it expires to confirm the booking.',
  },
  confirmed: {
    label: 'Booking Confirmed',
    description: "We're excited to host your event. Your booking has been successfully confirmed.",
  },
  completed: {
    label: 'Event Completed',
    description: 'This booking has been completed.',
  },
  owner_rejected: {
    label: 'Booking Rejected',
    description: 'The venue owner declined this booking.',
  },
  user_cancelled: {
    label: 'Booking Cancelled',
    description: 'This booking has been cancelled.',
  },
  admin_cancelled: {
    label: 'Booking Cancelled',
    description: 'This booking has been cancelled.',
  },
  conflict_cancelled: {
    label: 'Booking Cancelled',
    description: 'This booking was cancelled due to a scheduling conflict.',
  },
  hold_expired: {
    label: 'Hold Expired',
    description: 'The payment hold for this booking has expired.',
  },
  request_expired: {
    label: 'Request Expired',
    description: 'This booking request has expired.',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatStatus(value: string) {
  return value
    .split('_')
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' ')
}

export function BookingHero({ booking }: Props) {
  const meta = STATUS_META[booking.status] ?? STATUS_META.requested

  return (
    <section className="border-b border-zinc-200 py-12 dark:border-ink-800">
      <div className="flex items-start gap-5">
        <StatusBadge status={booking.status} />

        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{meta.label}</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {meta.label === 'Booking Confirmed' ? 'Your booking is confirmed!' : meta.label}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {meta.description}
          </p>

          <div className="mt-4 text-sm text-zinc-500">
            {formatDate(booking.starts_at)}
            <span className="mx-2">•</span>
            {formatTime(booking.starts_at)} – {formatTime(booking.ends_at)}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-ink-800 md:grid-cols-3 grid gap-6">
        <MetaRow label="Booking ID" value={`#${booking.id.slice(0, 8).toUpperCase()}`} />
        <MetaRow
          label="Payment Status"
          value={formatStatus(booking.payment_status)}
          status="success"
        />
        <MetaRow label="Booked On" value={booking.created_at ? formatDate(booking.created_at) : '—'} />
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusColor =
    status === 'confirmed' || status === 'completed' || status === 'owner_accepted'
      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600'
      : status.includes('cancelled') || status.includes('rejected')
        ? 'bg-red-100 dark:bg-red-950/40 text-red-600'
        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'

  return (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${statusColor}`}
    >
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {status === 'confirmed' || status === 'completed' || status === 'owner_accepted' ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : status.includes('cancelled') || status.includes('rejected') ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )}
      </svg>
    </span>
  )
}

function MetaRow({
  label,
  value,
  status,
}: {
  label: string
  value: React.ReactNode
  status?: 'success'
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p
        className={`mt-1.5 font-medium ${
          status === 'success'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-900 dark:text-zinc-100'
        }`}
      >
        {value}
      </p>
    </div>
  )
}