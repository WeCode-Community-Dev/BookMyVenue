import { NotificationItem, NotificationView } from './NotificationItem'

interface NotificationListProps {
  notifications: NotificationView[]
  onOpen: (notification: NotificationView) => void
  emptyLabel?: string
}

function getDateGroup(iso: string): 'Today' | 'Yesterday' | 'Earlier' {
  const date = new Date(iso)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return 'Earlier'
}

const GROUP_ORDER = ['Today', 'Yesterday', 'Earlier'] as const

export function NotificationList({
  notifications,
  onOpen,
  emptyLabel = 'No notifications yet',
}: NotificationListProps) {
  if (notifications.length === 0) {
    return <p className="px-3 py-6 text-center text-sm text-zinc-400">{emptyLabel}</p>
  }

  const groups = new Map<string, NotificationView[]>()
  for (const n of notifications) {
    const key = getDateGroup(n.created_at)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(n)
  }

  return (
    <div className="divide-y divide-zinc-100">
      {GROUP_ORDER.filter((g) => groups.has(g)).map((group) => (
        <div key={group}>
          <div className="bg-zinc-50/60 px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            {group}
          </div>
          <div className="divide-y divide-zinc-100">
            {groups.get(group)!.map((n) => (
              <NotificationItem key={n.id} notification={n} onOpen={onOpen} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
