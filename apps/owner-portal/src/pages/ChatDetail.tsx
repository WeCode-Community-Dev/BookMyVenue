import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MessageSquare, User } from 'lucide-react'

import { createClient, bookingEndpoints } from '@venue404/api-client'
import { ChatWindow } from '@venue404/ui'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../lib/AuthContext'

function ChatDetailSkeleton() {
  return (
    <div className="space-y-5 pb-8">
      <div className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
      <div className="h-[620px] animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return 'Booking date pending'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ChatDetail() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const client = createClient()

  const { user } = useAuth()
  const currentUserId = user?.id || ''
  const { messages, isLoading: isChatLoading, isConnected, sendMessage } = useChat(bookingId!, currentUserId)

  const bookingQuery = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingEndpoints(client).getBooking(bookingId!),
    enabled: !!bookingId,
  })

  const booking = bookingQuery.data

  if (bookingQuery.isLoading) {
    return <ChatDetailSkeleton />
  }

  if (bookingQuery.isError || !booking) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-16 text-center dark:border-ink-800 dark:bg-ink-900/60">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm dark:bg-ink-850 dark:text-zinc-500">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Chat not available
        </h2>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Unable to load booking conversation.
        </p>
        <button
          onClick={() => navigate('/messages')}
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover"
        >
          Back to Messages
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate('/messages')}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300 dark:hover:bg-ink-800 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {booking.user_full_name || 'Guest'}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="truncate">{booking.venue_name}</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(booking.starts_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/bookings/${bookingId}`)}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300 dark:hover:bg-ink-800"
          >
            View Booking
          </button>
        </div>
      </section>

      <div className="h-[calc(100vh-15rem)] min-h-[540px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <ChatWindow
          messages={messages.map(msg => ({
            ...msg,
            sender_name: msg.sender_id === currentUserId
              ? (user?.profile?.full_name || user?.email || undefined)
              : (booking?.user_full_name || undefined),
          }))}
          currentUserId={currentUserId}
          onSendMessage={sendMessage}
          isLoading={isChatLoading}
          isConnected={isConnected}
        />
      </div>
    </div>
  )
}
