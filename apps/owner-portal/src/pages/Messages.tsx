import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createClient, chatEndpoints } from '@venue404/api-client'
import { CalendarDays, MapPin, MessageSquare, User } from 'lucide-react'

function formatDate(value: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function previewMessage(message: string | null) {
  if (!message) return 'No messages yet'
  return message.length > 72 ? `${message.slice(0, 72)}...` : message
}

function ConversationSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900"
        >
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-2/5 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
            </div>
            <div className="h-4 w-12 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Messages() {
  const client = createClient()

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['owner-chat-conversations'],
    queryFn: () => chatEndpoints(client).listConversations(),
  })

  const unreadTotal = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0)

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Messages
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Conversations linked to customer bookings
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-brand" />
            {unreadTotal > 0 ? `${unreadTotal} unread` : `${conversations.length} conversations`}
          </div>
        </div>
      </section>

      {isLoading ? (
        <ConversationSkeleton />
      ) : conversations.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-16 text-center dark:border-ink-800 dark:bg-ink-900/60">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm dark:bg-ink-850 dark:text-zinc-500">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No conversations yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Messages from customers will appear here once a booking conversation starts.
          </p>
        </section>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
          <div className="divide-y divide-zinc-100 dark:divide-ink-800">
            {conversations.map((conv) => {
              const unreadCount = conv.unread_count || 0

              return (
                <Link
                  key={conv.booking_id}
                  to={`/messages/${conv.booking_id}`}
                  className={`group grid gap-4 px-4 py-4 transition-colors hover:bg-zinc-50 sm:grid-cols-[minmax(0,1fr)_auto] dark:hover:bg-ink-800/70 ${
                    unreadCount > 0 ? 'bg-brand-light/30 dark:bg-brand/10' : ''
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/70 dark:bg-ink-800 dark:text-zinc-300 dark:ring-ink-700">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <h2 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {conv.other_party_name || 'Guest'}
                        </h2>
                        {unreadCount > 0 && (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="inline-flex min-w-0 items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{conv.venue_name}</span>
                        </span>
                        {conv.booking_date && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(conv.booking_date)}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {previewMessage(conv.last_message)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pl-[3.75rem] sm:flex-col sm:items-end sm:justify-start sm:pl-0">
                    {conv.last_message_at && (
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {formatDate(conv.last_message_at)}
                      </span>
                    )}
                    <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium capitalize text-zinc-500 transition-colors group-hover:border-brand/30 group-hover:text-brand dark:border-ink-700 dark:text-zinc-400">
                      {conv.booking_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
