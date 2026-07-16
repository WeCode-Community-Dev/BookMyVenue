import { ChatWindow } from '@venue404/ui'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../lib/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { createClient, bookingEndpoints } from '@venue404/api-client'

type ChatTabProps = {
  bookingId: string
}

export function ChatTab({ bookingId }: ChatTabProps) {
  const { user } = useAuth()
  const currentUserId = user?.id || ''
  const { messages, isLoading, isConnected, sendMessage } = useChat(bookingId)

  // Get booking info to determine sender names
  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingEndpoints(createClient()).getBooking(bookingId),
    enabled: !!bookingId,
  })

  // Add sender_name to messages based on sender_id
  const messagesWithNames = messages.map(msg => ({
    ...msg,
    sender_name: msg.sender_id === currentUserId 
      ? (user?.profile?.full_name || user?.email || undefined) 
      : (booking?.user_full_name || undefined),
  }))

  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl border border-zinc-200 dark:border-ink-800 shadow-sm">
      <ChatWindow
        messages={messagesWithNames}
        currentUserId={currentUserId}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        isConnected={isConnected}
      />
    </div>
  )
}