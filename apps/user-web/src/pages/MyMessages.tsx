import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CalendarDays,
  ChevronLeft,
  MapPin,
  MessageSquare,
  Search,
  Wifi,
  WifiOff,
} from 'lucide-react'

import { createClient, bookingEndpoints, chatEndpoints, type Conversation } from '@venue404/api-client'
import { ChatWindow, StatusBadge } from '@venue404/ui'
import { AppNavbar } from '../components/shared/AppNavbar'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../lib/AuthContext'

function formatShortDate(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  if (sameDay) {
    return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatFullDate(value: string | null | undefined) {
  if (!value) return 'Date pending'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function previewMessage(message: string | null) {
  if (!message) return 'No messages yet — say hello'
  return message.length > 64 ? `${message.slice(0, 64)}…` : message
}

function bookingStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending' {
  const s = status.toLowerCase()
  if (s.includes('confirm') || s === 'completed') return 'success'
  if (s.includes('pending') || s.includes('hold') || s.includes('request')) return 'pending'
  if (s.includes('cancel') || s.includes('reject') || s.includes('expire')) return 'danger'
  if (s.includes('paid') || s.includes('active')) return 'info'
  return 'neutral'
}

function ConversationSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900"
        >
          <div className="flex gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MyMessages() {
  const client = createClient()
  const navigate = useNavigate()
  const { bookingId: activeBookingId } = useParams<{ bookingId: string }>()
  const { user } = useAuth()
  const currentUserId = user?.id || ''
  const [search, setSearch] = useState('')

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: () => chatEndpoints(client).listConversations(),
    refetchInterval: 30_000,
  })

  // Fallback booking details when conversation isn't in the inbox yet (no messages)
  const bookingFallbackQuery = useQuery({
    queryKey: ['booking', activeBookingId],
    queryFn: () => bookingEndpoints(client).getBooking(activeBookingId!),
    enabled: !!activeBookingId && !conversations.some((c) => c.booking_id === activeBookingId),
  })

  const activeConversation: Conversation | null = useMemo(() => {
    const found = conversations.find((c) => c.booking_id === activeBookingId)
    if (found) return found
    const booking = bookingFallbackQuery.data
    if (!booking || !activeBookingId) return null
    return {
      booking_id: activeBookingId,
      venue_name: booking.venue_name || 'Venue',
      venue_city: null,
      booking_status: booking.status || 'unknown',
      booking_date: booking.starts_at || null,
      other_party_name: null,
      last_message: null,
      last_message_at: null,
      last_sender_id: null,
      unread_count: 0,
    }
  }, [conversations, activeBookingId, bookingFallbackQuery.data])

  const { messages, isLoading: isChatLoading, isConnected, sendMessage, sendError } = useChat(
    activeBookingId || '',
    currentUserId,
  )

  const unreadTotal = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(
      (c) =>
        c.venue_name.toLowerCase().includes(q) ||
        (c.venue_city || '').toLowerCase().includes(q) ||
        (c.last_message || '').toLowerCase().includes(q) ||
        (c.other_party_name || '').toLowerCase().includes(q),
    )
  }, [conversations, search])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
        <AppNavbar />
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
          <Header unreadTotal={0} conversationCount={0} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[340px_minmax(0,1fr)]">
            <ConversationSkeleton />
            <div className="hidden h-[620px] animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800 md:block" />
          </div>
        </div>
      </div>
    )
  }

  if (conversations.length === 0 && !activeBookingId) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
        <AppNavbar />
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Header unreadTotal={0} conversationCount={0} />
          <div className="mt-8 rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center dark:border-ink-800 dark:bg-ink-900/60">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand shadow-sm dark:bg-brand/15 dark:text-brand-secondary">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              No conversations yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              After you book a venue, you can message the owner here about setup, timings, and special requests.
            </p>
            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover"
            >
              View my bookings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
      <AppNavbar />
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        <Header unreadTotal={unreadTotal} conversationCount={conversations.length} />

        <div className="grid h-[calc(100vh-12.5rem)] min-h-[560px] grid-cols-1 gap-4 md:grid-cols-[340px_minmax(0,1fr)]">
          <aside
            className={`${activeBookingId ? 'hidden md:flex' : 'flex'} min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900`}
          >
            <div className="border-b border-zinc-100 px-3 py-3 dark:border-ink-800">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search venues or messages…"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-muted dark:border-ink-700 dark:bg-ink-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No conversations match “{search}”
                </p>
              ) : (
                filtered.map((conv) => {
                  const unreadCount = conv.unread_count || 0
                  const isActive = activeBookingId === conv.booking_id

                  return (
                    <button
                      key={conv.booking_id}
                      type="button"
                      onClick={() => navigate(`/messages/${conv.booking_id}`)}
                      className={`group mb-1 w-full rounded-xl border p-3 text-left transition-all ${
                        isActive
                          ? 'border-brand/30 bg-brand-light/40 shadow-sm dark:border-brand/30 dark:bg-brand/15'
                          : unreadCount > 0
                            ? 'border-brand/15 bg-brand-light/25 hover:border-brand/25 dark:border-brand/20 dark:bg-brand/10'
                            : 'border-transparent hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-ink-700 dark:hover:bg-ink-800/70'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isActive
                              ? 'bg-brand text-white'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-300'
                          }`}
                        >
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h2
                              className={`truncate text-sm font-semibold ${
                                unreadCount > 0 && !isActive
                                  ? 'text-brand dark:text-brand-secondary'
                                  : 'text-zinc-900 dark:text-zinc-100'
                              }`}
                            >
                              {conv.venue_name}
                            </h2>
                            {conv.last_message_at && (
                              <span className="shrink-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                                {formatShortDate(conv.last_message_at)}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{conv.venue_city || 'Venue'}</span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-xs ${
                                unreadCount > 0 && !isActive
                                  ? 'font-medium text-zinc-700 dark:text-zinc-200'
                                  : 'text-zinc-500 dark:text-zinc-400'
                              }`}
                            >
                              {previewMessage(conv.last_message)}
                            </p>
                            {unreadCount > 0 && (
                              <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </aside>

          <main className={`${!activeBookingId ? 'hidden md:flex' : 'flex'} min-h-0 flex-col`}>
            {activeBookingId && activeConversation ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
                <div className="flex shrink-0 flex-col gap-3 border-b border-zinc-100 px-4 py-3 dark:border-ink-800 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/messages')}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300 dark:hover:bg-ink-800 md:hidden"
                      aria-label="Back to conversations"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {activeConversation.venue_name}
                        </h2>
                        <StatusBadge
                          label={activeConversation.booking_status.replace(/_/g, ' ')}
                          variant={bookingStatusVariant(activeConversation.booking_status)}
                          className="capitalize"
                        />
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          {isConnected ? (
                            <Wifi className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <WifiOff className="h-3 w-3 text-amber-500" />
                          )}
                          {isConnected ? 'Live' : 'Reconnecting'}
                        </span>
                        {activeConversation.booking_date && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatFullDate(activeConversation.booking_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/bookings/${activeBookingId}`)}
                    className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300 dark:hover:bg-ink-800"
                  >
                    View booking
                  </button>
                </div>

                {sendError && (
                  <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    {sendError}
                  </div>
                )}

                <div className="min-h-0 flex-1">
                  <ChatWindow
                    messages={messages.map((msg) => ({
                      ...msg,
                      sender_name:
                        msg.sender_id === currentUserId
                          ? user?.profile?.full_name || user?.email || 'You'
                          : activeConversation.other_party_name || activeConversation.venue_name,
                    }))}
                    currentUserId={currentUserId}
                    onSendMessage={sendMessage}
                    isLoading={isChatLoading || bookingFallbackQuery.isLoading}
                    isConnected={isConnected}
                    footerHint="Messages are tied to this booking"
                  />
                </div>
              </div>
            ) : activeBookingId && bookingFallbackQuery.isLoading ? (
              <div className="h-full animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
            ) : activeBookingId && bookingFallbackQuery.isError ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 text-center dark:border-ink-800 dark:bg-ink-900/60">
                <MessageSquare className="mb-3 h-8 w-8 text-zinc-400" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Conversation unavailable
                </h3>
                <p className="mt-2 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
                  You may not have access to this booking chat.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/messages')}
                  className="mt-5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
                >
                  Back to inbox
                </button>
              </div>
            ) : (
              <div className="hidden h-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 text-center dark:border-ink-800 dark:bg-ink-900/60 md:flex">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 shadow-sm dark:bg-ink-850 dark:text-zinc-500">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Select a conversation
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Choose a booking conversation to view messages and reply in real time.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function Header({
  unreadTotal,
  conversationCount,
}: {
  unreadTotal: number
  conversationCount: number
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Messages
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Booking conversations with venue owners
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300">
          <span className={`h-2 w-2 rounded-full ${unreadTotal > 0 ? 'bg-brand' : 'bg-zinc-300 dark:bg-ink-600'}`} />
          {unreadTotal > 0 ? `${unreadTotal} unread` : `${conversationCount} conversation${conversationCount === 1 ? '' : 's'}`}
        </div>
      </div>
    </section>
  )
}
