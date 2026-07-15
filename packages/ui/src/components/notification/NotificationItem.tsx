import { cn } from '../../lib/utils'

export interface NotificationView {
  id: string
  booking_id: string | null
  type: string
  title: string
  body: string
  read_at: string | null
  created_at: string
}

interface NotificationItemProps {
  notification: NotificationView
  onOpen: (notification: NotificationView) => void
}

// ─── Icon + accent config per notification type ─────────────────────────────
type IconConfig = {
  icon: (props: { className?: string }) => JSX.Element
  iconBg: string
  iconColor: string
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75l2.25 2.25 4.5-4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.75 9h4.5l1.5 3h4.5l1.5-3h4.5M3.75 9l1.148-4.594A1.5 1.5 0 016.352 3.25h11.296a1.5 1.5 0 011.454 1.156L20.25 9M3.75 9v8.25A1.5 1.5 0 005.25 18.75h13.5a1.5 1.5 0 001.5-1.5V9"
      />
    </svg>
  )
}

function ThumbUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.017.163.026.328.026.494 0 1.011-.463 1.917-1.188 2.513a2.25 2.25 0 01-1.63 3.634c-.053.583-.26 1.124-.575 1.575a2.25 2.25 0 01-2.161 3.24H8.25a3.75 3.75 0 01-3.75-3.75V13.5a3 3 0 013-3z"
      />
    </svg>
  )
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0V11.25A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  )
}

const NOTIFICATION_CONFIG: Record<string, IconConfig> = {
  payment_confirmed: {
    icon: CheckCircleIcon,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  balance_paid: { icon: CheckCircleIcon, iconBg: 'bg-emerald-50 dark:bg-emerald-950/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  request_received: { icon: InboxIcon, iconBg: 'bg-zinc-100 dark:bg-ink-800', iconColor: 'text-zinc-500 dark:text-zinc-400 dark:text-zinc-500' },
  request_accepted: { icon: ThumbUpIcon, iconBg: 'bg-amber-50 dark:bg-amber-950/30', iconColor: 'text-amber-600 dark:text-amber-400' },
  hold_expired: { icon: ClockIcon, iconBg: 'bg-zinc-100 dark:bg-ink-800', iconColor: 'text-zinc-400 dark:text-zinc-500' },
  balance_payment_overdue: {
    icon: AlertTriangleIcon,
    iconBg: 'bg-red-50 dark:bg-red-950/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  balance_deadline_extended: {
    icon: CalendarIcon,
    iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  booking_unavailable: { icon: XCircleIcon, iconBg: 'bg-red-50 dark:bg-red-950/30', iconColor: 'text-red-600 dark:text-red-400' },
}

const DEFAULT_CONFIG: IconConfig = {
  icon: BellIcon,
  iconBg: 'bg-zinc-100 dark:bg-ink-800',
  iconColor: 'text-zinc-400 dark:text-zinc-500',
}

const ACTIONABLE_TYPES = new Set([
  'request_accepted',
  'balance_payment_overdue',
  'balance_deadline_extended',
])

const CHAT_TYPES = new Set(['chat_message'])

export function getNotificationPath(notification: NotificationView): string | null {
  if (!notification.booking_id) return null

  if (CHAT_TYPES.has(notification.type)) {
    return `/messages/${notification.booking_id}`
  }

  if (ACTIONABLE_TYPES.has(notification.type)) {
    return `/payment/${notification.booking_id}`
  }

  return `/bookings/${notification.booking_id}`
}
function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function NotificationItem({ notification, onOpen }: NotificationItemProps) {
  const unread = notification.read_at == null
  const config = NOTIFICATION_CONFIG[notification.type] ?? DEFAULT_CONFIG
  const Icon = config.icon
  const navigable = getNotificationPath(notification) !== null

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={cn(
        'press group flex w-full items-start gap-3.5 px-5 py-4 text-left transition-colors',
        unread
          ? 'bg-emerald-50/40 hover:bg-emerald-50/70 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30'
          : 'hover:bg-zinc-50 dark:hover:bg-ink-800 dark:bg-ink-800 dark:hover:bg-ink-800'
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
          config.iconBg
        )}
      >
        <Icon className={cn('h-4.5 w-4.5', config.iconColor)} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-center gap-2">
          {unread && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
          )}
          <span
            className={cn(
              'truncate text-sm',
              unread ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600'
            )}
          >
            {notification.title}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{notification.body}</p>
        <span className="mt-1 block text-[11px] text-zinc-400 dark:text-zinc-500">
          {formatRelativeTime(notification.created_at)}
        </span>
      </div>

      {navigable && (
        <svg
          className="mt-2.5 h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400 dark:text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 dark:group-hover:text-zinc-400 dark:text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  )
}
