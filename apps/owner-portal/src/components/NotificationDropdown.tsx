import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient, notificationEndpoints } from '@venue404/api-client'
import { NotificationList, NotificationView } from '@venue404/ui'
import { getNotificationPath } from '@venue404/ui'
import { Bell } from 'lucide-react'

// ─── Skeleton ────────────────────────────────────────────────────────────────
function NotificationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="divide-y divide-zinc-100 dark:divide-ink-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3.5 p-5">
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="h-3.5 w-32 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
              <div className="h-3 w-full animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
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
    <div className="py-20 text-center">
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-ink-800">
        <svg
          className="h-6 w-6 text-zinc-400"
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
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Couldn't load notifications</p>
      <p className="mt-1 text-sm text-zinc-400">
        We had trouble fetching your updates. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="press mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover"
      >
        Retry
      </button>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function NotificationsEmpty() {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
        <svg
          className="h-6 w-6 text-emerald-500"
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
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No notifications yet</p>
      <p className="mt-1 text-sm text-zinc-400">
        We'll let you know when something needs your attention.
      </p>
    </div>
  )
}

// ─── Dropdown Component ───────────────────────────────────────────────────────
export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const client = createClient()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

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
  const unreadCount = unreadIds.length

  const handleOpen = (notification: NotificationView) => {
    if (notification.read_at == null) {
      markReadMutation.mutate(notification.id)
    }
    const path = getNotificationPath(notification)
    if (path) {
      navigate(path)
      setOpen(false)
    }
  }

  const markAllButton = unreadCount > 0 ? (
    <button
      onClick={() => markAllReadMutation.mutate(unreadIds)}
      disabled={markAllReadMutation.isPending}
      className="press shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition-colors"
    >
      Mark all as read
    </button>
  ) : null

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)} 
        className="relative p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-ink-800"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[400px] sm:w-[520px] max-w-[calc(100vw-2rem)] origin-top-right rounded-2xl bg-white dark:bg-ink-900 shadow-2xl border border-zinc-200 dark:border-ink-800 focus:outline-none z-50 overflow-hidden flex flex-col max-h-[65vh]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-ink-800 shrink-0">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h3>
            {markAllButton}
          </div>
          <div className="overflow-y-auto flex-1 p-0 m-0">
            {isLoading ? (
              <NotificationsSkeleton />
            ) : isError ? (
              <NotificationsError onRetry={() => void refetch()} />
            ) : notifications.length === 0 ? (
              <NotificationsEmpty />
            ) : (
              <NotificationList notifications={notifications} onOpen={handleOpen} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
