import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, ChevronLeft, MapPin, MessageSquare } from 'lucide-react'

import { createClient, chatEndpoints } from '@venue404/api-client'
import { AppNavbar } from '../components/shared/AppNavbar'
import { ChatWindow } from '@venue404/ui'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../lib/AuthContext'

function formatDate(value: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function previewMessage(message: string | null) {
  if (!message) return 'No messages yet'
  return message.length > 64 ? `${message.slice(0, 64)}...` : message
}

function ConversationSkeleton() {
  return (
    <div className="space-y-2">
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

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: () => chatEndpoints(client).listConversations(),
  })

  const activeConversation = conversations.find(c => c.booking_id === activeBookingId)

  const { messages, isLoading: isChatLoading, isConnected, sendMessage } = useChat(
    activeBookingId || ''
  )

  const unreadTotal = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <AppNavbar />
        <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
          <Header unreadTotal={0} conversationCount={0} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[340px_minmax(0,1fr)]">
            <ConversationSkeleton />
            <div className="hidden h-[620px] animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800 md:block" />
          </div>
        </div>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <AppNavbar />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Header unreadTotal={0} conversationCount={0} />
          <div className="mt-8 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-16 text-center dark:border-ink-800 dark:bg-ink-900/60">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm dark:bg-ink-850 dark:text-zinc-500">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              No conversations yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Chat will be available after you make a booking and start a conversation.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <AppNavbar />
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <Header unreadTotal={unreadTotal} conversationCount={conversations.length} />

        <div className="grid h-[calc(100vh-13rem)] min-h-[620px] grid-cols-1 gap-6 md:grid-cols-[340px_minmax(0,1fr)]">
          <aside className={`${activeBookingId ? 'hidden md:flex' : 'flex'} min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900`}>
            <div className="border-b border-zinc-100 px-4 py-3 dark:border-ink-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Booking conversations
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {conversations.map((conv) => {
                const unreadCount = conv.unread_count || 0
                const isActive = activeBookingId === conv.booking_id

                return (
                  <button
                    key={conv.booking_id}
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
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isActive
                          ? 'bg-brand text-white'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-ink-800 dark:text-zinc-300'
                      }`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className={`truncate text-sm font-semibold ${
                            unreadCount > 0 && !isActive
                              ? 'text-brand dark:text-brand-secondary'
                              : 'text-zinc-900 dark:text-zinc-100'
                          }`}>
                            {conv.venue_name}
                          </h2>
                          {conv.last_message_at && (
                            <span className="shrink-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                              {formatDate(conv.last_message_at)}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{conv.venue_city || 'Venue location'}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
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
              })}
            </div>
          </aside>

          <main className={`${!activeBookingId ? 'hidden md:flex' : 'flex'} min-h-0 flex-col`}>
            {activeBookingId && activeConversation ? (
              <>
                <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        onClick={() => navigate('/messages')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300 dark:hover:bg-ink-800 md:hidden"
                        aria-label="Back to conversations"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {activeConversation.venue_name}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                          <span>Chat with venue owner</span>
                          {activeConversation.booking_date && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(activeConversation.booking_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/bookings/${activeBookingId}`)}
                      className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300 dark:hover:bg-ink-800"
                    >
                      View Booking
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
                  <ChatWindow
                    messages={messages.map(msg => ({
                      ...msg,
                      sender_name: msg.sender_id === currentUserId
                        ? (user?.profile?.full_name || user?.email || undefined)
                        : (activeConversation?.other_party_name || undefined),
                    }))}
                    currentUserId={currentUserId}
                    onSendMessage={sendMessage}
                    isLoading={isChatLoading}
                    isConnected={isConnected}
                  />
                </div>
              </>
            ) : (
              <div className="hidden h-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 text-center dark:border-ink-800 dark:bg-ink-900/60 md:flex">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm dark:bg-ink-850 dark:text-zinc-500">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Select a conversation
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Choose a booking conversation to view messages and reply.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function Header({ unreadTotal, conversationCount }: { unreadTotal: number; conversationCount: number }) {
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
              Keep booking conversations in one place
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-ink-800 dark:bg-ink-950 dark:text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-brand" />
          {unreadTotal > 0 ? `${unreadTotal} unread` : `${conversationCount} conversations`}
        </div>
      </div>
    </section>
  )
}
