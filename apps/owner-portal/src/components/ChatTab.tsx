import { ChatWindow } from '@venue404/ui'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../lib/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { createClient, bookingEndpoints } from '@venue404/api-client'
import { MessageSquare } from 'lucide-react'

type ChatTabProps = {
  bookingId: string
}

export function ChatTab({ bookingId }: ChatTabProps) {
  const { user } = useAuth()
  const currentUserId = user?.id || ''
  const { messages, isLoading, isConnected, sendMessage, sendError } = useChat(
    bookingId,
    currentUserId,
  )

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingEndpoints(createClient()).getBooking(bookingId),
    enabled: !!bookingId,
  })

  const messagesWithNames = messages.map((msg) => ({
    ...msg,
    sender_name:
      msg.sender_id === currentUserId
        ? user?.profile?.full_name || user?.email || 'You'
        : booking?.user_full_name || 'Guest',
  }))

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-ink-800">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Chat with {booking?.user_full_name || 'guest'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isConnected ? 'Connected · messages update live' : 'Reconnecting…'}
            </p>
          </div>
        </div>
      </div>

      {sendError && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {sendError}
        </div>
      )}

      <div className="h-[min(520px,60vh)] min-h-[360px]">
        <ChatWindow
          messages={messagesWithNames}
          currentUserId={currentUserId}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
          footerHint="Visible only to you and this guest"
        />
      </div>
    </div>
  )
}
