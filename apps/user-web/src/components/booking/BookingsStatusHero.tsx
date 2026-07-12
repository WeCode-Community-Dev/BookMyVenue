import type { BookingOut } from '../../types'

import { formatDate, formatTime } from '../../utils'

type Props = {
  booking: BookingOut
}

const STATUS_META = {
  requested: {
    label: 'Requested',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    dot: 'bg-amber-500',
    description: 'Your booking request has been submitted and is awaiting venue approval.',
  },

  payment_pending: {
    label: 'Awaiting Payment',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    dot: 'bg-amber-500',
    description:
      'Your slot is reserved. Complete payment before the timer runs out to confirm your booking.',
  },

  owner_accepted: {
    label: 'Accepted',
    color: 'bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary',
    dot: 'bg-brand',
    description:
      'The venue owner has accepted your booking. Complete payment to secure your reservation.',
  },

  confirmed: {
    label: 'Confirmed',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    description: 'Your venue booking has been confirmed.',
  },

  completed: {
    label: 'Completed',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    description: 'This event has been completed.',
  },

  hold_expired: {
    label: 'Expired',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-400',
    dot: 'bg-zinc-400',
    description: 'The booking hold period expired before payment was completed.',
  },

  request_expired: {
    label: 'Expired',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-400',
    dot: 'bg-zinc-400',
    description: 'The booking request expired before owner action.',
  },

  owner_rejected: {
    label: 'Rejected',
    color: 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-400',
    dot: 'bg-zinc-400',
    description: 'The venue owner declined this booking request.',
  },

  user_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    dot: 'bg-red-500',
    description: 'This booking was cancelled.',
  },

  admin_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    dot: 'bg-red-500',
    description: 'This booking was cancelled.',
  },

  conflict_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    dot: 'bg-red-500',
    description: 'This booking was cancelled due to a scheduling conflict.',
  },

  balance_overdue_cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    dot: 'bg-red-500',
    description: 'The booking was cancelled because the balance payment became overdue.',
  },
} as const

export function BookingStatusHero({ booking }: Props) {
  const meta = STATUS_META[booking.status as keyof typeof STATUS_META] ?? STATUS_META.requested

  return (
    <div className="brand-glow relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-7">
      <div className="space-y-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-balance text-zinc-900 dark:text-zinc-100">
            {meta.label}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">{meta.description}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatDate(booking.starts_at)}
            </span>
            <span className="text-zinc-300 dark:text-ink-600">•</span>
            <span>
              {formatTime(booking.starts_at)} – {formatTime(booking.ends_at)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-zinc-100 pt-5 dark:border-ink-800">
          <div>
            <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              Booking ID
            </div>
            <div className="mt-1 break-all font-mono text-sm text-zinc-900 dark:text-zinc-100">
              {booking.id}
            </div>
          </div>

          <div>
            <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">Payment</div>
            <div className="mt-1 text-sm font-medium capitalize text-zinc-900 dark:text-zinc-100">
              {booking.payment_status.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
