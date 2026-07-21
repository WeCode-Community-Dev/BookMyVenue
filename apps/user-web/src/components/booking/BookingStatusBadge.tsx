type Props = {
  status: string
}

const STATUS_CONFIG = {
  requested: {
    label: 'Pending',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
  },

  payment_pending: {
    label: 'Awaiting Payment',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
  },

  owner_accepted: {
    label: 'Accepted',
    className:
      'bg-brand-light text-brand border-brand-muted dark:bg-brand/15 dark:text-brand-secondary dark:border-brand/30',
  },

  confirmed: {
    label: 'Confirmed',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
  },

  completed: {
    label: 'Completed',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
  },

  user_cancelled: {
    label: 'Cancelled',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50',
  },

  admin_cancelled: {
    label: 'Cancelled',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50',
  },

  owner_rejected: {
    label: 'Declined',
    className:
      'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-ink-800 dark:text-zinc-400 dark:border-ink-700',
  },

  conflict_cancelled: {
    label: 'Cancelled',
    className:
      'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-ink-800 dark:text-zinc-400 dark:border-ink-700',
  },

  hold_expired: {
    label: 'Expired',
    className:
      'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-ink-800 dark:text-zinc-400 dark:border-ink-700',
  },

  request_expired: {
    label: 'Expired',
    className:
      'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-ink-800 dark:text-zinc-400 dark:border-ink-700',
  },

  balance_overdue_cancelled: {
    label: 'Balance Overdue',
    className:
      'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50',
  },
} as const

export default function BookingStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]

  if (!config) return null

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
