import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient, notificationEndpoints } from '@venue404/api-client'
import { AppNavbar } from '../components/shared/AppNavbar'
import { NotificationList, NotificationView } from '@venue404/ui'
import { getNotificationPath } from '@venue404/ui'

// ─── Skeleton ────────────────────────────────────────────────────────────────
function NotificationsSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-2xl bg-zinc-100" />
      <div className="h-4 w-72 animate-pulse rounded-lg bg-zinc-100" />
      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm divide-y divide-zinc-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3.5 p-5">
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-zinc-100" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="h-3.5 w-32 animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Error state ─────────────────────────────────────────────────────────────
function NotificationsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
          <svg
            className="h-6 w-6 text-zinc-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-zinc-900">Couldn't load notifications</p>
        <p className="mt-1 text-sm text-zinc-400">
          We had trouble fetching your updates. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="press mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function NotificationsEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
        <svg
          className="h-6 w-6 text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-zinc-900">No notifications yet</p>
      <p className="mt-1 text-sm text-zinc-400">
        We'll let you know when something needs your attention.
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Notifications() {
  const client = createClient()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationEndpoints(client).list(),
    staleTime: 30 * 1000,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationEndpoints(client).markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => notificationEndpoints(client).markRead(id))),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const unreadIds = notifications.filter((n) => n.read_at == null).map((n) => n.id)

  const handleOpen = (notification: NotificationView) => {
    if (notification.read_at == null) {
      markReadMutation.mutate(notification.id)
    }
    const path = getNotificationPath(notification)
    if (path) navigate(path)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AppNavbar />
        <NotificationsSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <AppNavbar />
        <NotificationsError onRetry={() => void refetch()} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar />

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* ── Page header ─────────────────────────── */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Notifications</h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Booking updates, confirmations, and reminders.
            </p>
          </div>
          {unreadIds.length > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate(unreadIds)}
              disabled={markAllReadMutation.isPending}
              className="press shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* ── Notification list ───────────────────── */}
        {notifications.length === 0 ? (
          <NotificationsEmpty />
        ) : (
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
            <NotificationList notifications={notifications} onOpen={handleOpen} />
          </div>
        )}
      </div>
    </div>
  )
}
