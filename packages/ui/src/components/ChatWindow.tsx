import { useState, useRef, useEffect } from 'react'

type ChatWindowProps = {
  messages: ChatMessage[]
  currentUserId: string
  onSendMessage: (message: string) => void
  isLoading?: boolean
  isConnected?: boolean
  typingUsers?: string[] // User IDs that are currently typing
}

export type ChatMessage = {
  id: string
  booking_id: string
  sender_id: string
  sender_name?: string
  message: string
  created_at: string
  read_at: string | null
}

export function ChatWindow({
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false,
  isConnected = true,
  typingUsers = [],
}: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink-900">
      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-[300px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 dark:border-ink-700 border-t-brand" />
              <span className="text-sm">Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-ink-800 mb-3">
                <svg
                  className="h-6 w-6 text-zinc-400 dark:text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.89 9.89 0 01-5-1.372L3 21l2.372-4.628A8.956 8.956 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <MessagesList messages={messages} currentUserId={currentUserId} />
        )}
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-ink-800 bg-zinc-50/50 dark:bg-ink-900/50">
          <TypingIndicator users={typingUsers} />
        </div>
      )}

      {/* Connection Status */}
      <ConnectionStatus isConnected={isConnected} />

      {/* Message Input */}
      <MessageInput onSend={onSendMessage} disabled={!isConnected} />
    </div>
  )
}

type ConnectionStatusProps = {
  isConnected: boolean
}

function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  if (isConnected) return null

  return (
    <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-amber-700 text-sm flex items-center justify-center gap-2 dark:bg-ink-900 dark:border-ink-800 dark:text-amber-400">
      <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
      Connecting... Messages will send when connection is restored.
    </div>
  )
}

type TypingIndicatorProps = {
  users: string[]
}

function TypingIndicator({ users }: TypingIndicatorProps) {
  const userCount = users.length
  const text = userCount === 1 ? 'Someone is typing' : `${userCount} people are typing`
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{text}</span>
    </div>
  )
}

type MessagesListProps = {
  messages: ChatMessage[]
  currentUserId: string
}

function MessagesList({ messages, currentUserId }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

// Group consecutive messages from the same sender
  const groupedMessages = groupMessages(messages, currentUserId)

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
      {groupedMessages.map((group, index) => (
        <MessageGroup
          key={`${group.messages[0].id}-${index}`}
          messages={group.messages}
          isOwn={group.isOwn}
          showAvatar={group.showAvatar}
          senderName={group.senderName}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

// Helper to get initials from name
function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

// Group messages by consecutive sender
function groupMessages(messages: ChatMessage[], currentUserId: string): Array<{
  messages: ChatMessage[]
  isOwn: boolean
  showAvatar: boolean
  senderName?: string
}> {
  if (messages.length === 0) return []

  const groups: Array<{
    messages: ChatMessage[]
    isOwn: boolean
    showAvatar: boolean
    senderName?: string
  }> = []

  let currentGroup: ChatMessage[] = [messages[0]]
  let isOwn = messages[0].sender_id === currentUserId
  let senderName = messages[0].sender_name

  for (let i = 1; i < messages.length; i++) {
    const msg = messages[i]
    const prevMsg = messages[i - 1]
    const timeDiff = new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime()
    const sameSender = msg.sender_id === prevMsg.sender_id
    const isWithin5min = timeDiff < 5 * 60 * 1000

    if (sameSender && isWithin5min) {
      currentGroup.push(msg)
    } else {
      groups.push({
        messages: currentGroup,
        isOwn,
        showAvatar: true,
        senderName,
      })
      currentGroup = [msg]
      isOwn = msg.sender_id === currentUserId
      senderName = msg.sender_name
    }
  }

  groups.push({
    messages: currentGroup,
    isOwn,
    showAvatar: true,
    senderName,
  })
  return groups
}

type MessageGroupProps = {
  messages: ChatMessage[]
  isOwn: boolean
  showAvatar: boolean
  senderName?: string
}

function MessageGroup({ messages, isOwn, showAvatar, senderName }: MessageGroupProps) {
  const avatarContent = getInitials(senderName)
  const avatarColor = isOwn 
    ? 'bg-brand dark:bg-brand-secondary' 
    : 'bg-zinc-200 dark:bg-ink-700 border border-zinc-300 dark:border-ink-600'

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isOwn && showAvatar && (
        <div className={`h-8 w-8 shrink-0 rounded-full ${avatarColor} flex items-center justify-center text-xs font-semibold text-white dark:text-ink-950`}>
          {avatarContent}
        </div>
      )}
      
      <div className="flex flex-col">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg.message}
            isOwn={isOwn}
            createdAt={msg.created_at}
            showTimestamp={idx === messages.length - 1}
            readAt={msg.read_at}
          />
        ))}
      </div>
    </div>
  )
}

type MessageBubbleProps = {
  message: string
  isOwn: boolean
  createdAt: string
  showTimestamp?: boolean
  readAt?: string | null
}

function MessageBubble({ message, isOwn, createdAt, showTimestamp = true, readAt }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm transition-all ${
          isOwn
            ? 'bg-brand text-white rounded-br-md shadow-sm dark:bg-brand-secondary'
            : 'bg-zinc-100 text-zinc-900 rounded-bl-md shadow-sm dark:bg-ink-800 dark:text-zinc-100'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
        {showTimestamp && (
          <div className={`flex items-center justify-end gap-1.5 mt-1 ${isOwn ? 'text-brand-muted' : 'text-zinc-500 dark:text-zinc-400'}`}>
            <span className="text-[10px]">{time}</span>
            {isOwn && (
              readAt ? (
                // Double tick for read
                <svg className="h-3 w-3 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L11 17M17 7l-4 4L9 7m13 10l-4-4L15 14M5 7l4 4L9 7" />
                </svg>
              ) : (
                // Single tick for sent
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L11 17M17 7l-4 4L9 7" />
                </svg>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type MessageInputProps = {
  onSend: (message: string) => void
  disabled?: boolean
}

function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSend(value)
      setValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) {
        onSend(value)
        setValue('')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-zinc-200 dark:border-ink-800 flex gap-2 items-end"
    >
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className="w-full text-sm border border-zinc-300 dark:border-ink-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-muted focus:border-transparent disabled:opacity-50 bg-white dark:bg-ink-900 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-colors"
          maxLength={2000}
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-brand-hover transition-colors flex-shrink-0 shadow-sm disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  )
}