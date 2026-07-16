import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import { cn } from '../lib/utils'

export type ChatMessage = {
  id: string
  booking_id: string
  sender_id: string
  sender_name?: string
  message: string
  created_at: string
  read_at: string | null
  /** Optimistic / local-only message state */
  status?: 'sending' | 'sent' | 'failed'
}

type ChatWindowProps = {
  messages: ChatMessage[]
  currentUserId: string
  onSendMessage: (message: string) => void
  isLoading?: boolean
  isConnected?: boolean
  typingUsers?: string[]
  /** Optional footer note under the input (e.g. booking context) */
  footerHint?: string
  className?: string
  disabled?: boolean
  disabledReason?: string
}

const MAX_LENGTH = 2000

export function ChatWindow({
  messages,
  currentUserId,
  onSendMessage,
  isLoading = false,
  isConnected = true,
  typingUsers = [],
  footerHint,
  className,
  disabled = false,
  disabledReason,
}: ChatWindowProps) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col bg-white dark:bg-ink-900',
        className,
      )}
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        {isLoading ? (
          <LoadingState />
        ) : messages.length === 0 ? (
          <EmptyChatState />
        ) : (
          <MessagesList messages={messages} currentUserId={currentUserId} />
        )}
      </div>

      {typingUsers.length > 0 && (
        <div className="border-t border-zinc-100 bg-zinc-50/70 px-4 py-2 dark:border-ink-800 dark:bg-ink-900/60">
          <TypingIndicator users={typingUsers} />
        </div>
      )}

      <ConnectionStatus isConnected={isConnected} />

      <MessageInput
        onSend={onSendMessage}
        disabled={disabled || !isConnected}
        disabledReason={
          disabled
            ? disabledReason || 'Messaging is unavailable'
            : !isConnected
              ? 'Reconnecting…'
              : undefined
        }
        footerHint={footerHint}
      />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-3 px-4 py-5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}
        >
          <div
            className={cn(
              'h-10 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800',
              i % 2 === 0 ? 'w-2/5 max-w-[40%] rounded-bl-md' : 'w-1/3 max-w-[33%] rounded-br-md',
            )}
          />
        </div>
      ))}
    </div>
  )
}

function EmptyChatState() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="max-w-xs text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand shadow-sm dark:bg-brand/15 dark:text-brand-secondary">
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.89 9.89 0 01-5-1.372L3 21l2.372-4.628A8.956 8.956 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Start the conversation
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Ask about setup, timings, or special requests. Messages stay attached to this booking.
        </p>
      </div>
    </div>
  )
}

function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  if (isConnected) return null

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-t border-amber-200/80 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
      </span>
      Reconnecting… Messages will send when the connection is restored.
    </div>
  )
}

function TypingIndicator({ users }: { users: string[] }) {
  const text =
    users.length === 1 ? 'Someone is typing' : `${users.length} people are typing`

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <div className="flex items-center gap-1">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{text}</span>
    </div>
  )
}

// ─── Message list ────────────────────────────────────────────────────────────

type ListItem =
  | { kind: 'date'; key: string; label: string }
  | {
      kind: 'group'
      key: string
      messages: ChatMessage[]
      isOwn: boolean
      senderName?: string
    }

function formatDayLabel(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, d MMM yyyy')
}

function buildListItems(messages: ChatMessage[], currentUserId: string): ListItem[] {
  if (messages.length === 0) return []

  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  const items: ListItem[] = []
  let currentGroup: ChatMessage[] = []
  let groupIsOwn = false
  let groupSenderName: string | undefined
  let lastDay: Date | null = null

  const flushGroup = () => {
    if (currentGroup.length === 0) return
    items.push({
      kind: 'group',
      key: `g-${currentGroup[0].id}`,
      messages: currentGroup,
      isOwn: groupIsOwn,
      senderName: groupSenderName,
    })
    currentGroup = []
  }

  for (let i = 0; i < sorted.length; i++) {
    const msg = sorted[i]
    const msgDate = new Date(msg.created_at)
    const isOwn = msg.sender_id === currentUserId

    if (!lastDay || !isSameDay(lastDay, msgDate)) {
      flushGroup()
      items.push({
        kind: 'date',
        key: `d-${msgDate.toDateString()}`,
        label: formatDayLabel(msgDate),
      })
      lastDay = msgDate
    }

    const prev = currentGroup[currentGroup.length - 1]
    const canMerge =
      prev &&
      prev.sender_id === msg.sender_id &&
      new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime() < 5 * 60 * 1000

    if (!canMerge) {
      flushGroup()
      currentGroup = [msg]
      groupIsOwn = isOwn
      groupSenderName = msg.sender_name
    } else {
      currentGroup.push(msg)
    }
  }

  flushGroup()
  return items
}

function MessagesList({
  messages,
  currentUserId,
}: {
  messages: ChatMessage[]
  currentUserId: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [stickToBottom, setStickToBottom] = useState(true)
  const [showJump, setShowJump] = useState(false)
  const prevCountRef = useRef(messages.length)

  const items = useMemo(
    () => buildListItems(messages, currentUserId),
    [messages, currentUserId],
  )

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
    })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      const nearBottom = distance < 80
      setStickToBottom(nearBottom)
      setShowJump(!nearBottom)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const grew = messages.length > prevCountRef.current
    prevCountRef.current = messages.length
    if (stickToBottom || grew) {
      scrollToBottom(grew)
    }
  }, [messages, stickToBottom, scrollToBottom])

  // Initial jump without animation
  useEffect(() => {
    scrollToBottom(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain px-3 py-4 sm:px-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="space-y-3">
          {items.map((item) => {
            if (item.kind === 'date') {
              return (
                <div key={item.key} className="flex items-center justify-center py-1">
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-0.5 text-[11px] font-medium text-zinc-500 dark:border-ink-700 dark:bg-ink-850 dark:text-zinc-400">
                    {item.label}
                  </span>
                </div>
              )
            }

            return (
              <MessageGroup
                key={item.key}
                messages={item.messages}
                isOwn={item.isOwn}
                senderName={item.senderName}
              />
            )
          })}
        </div>
        <div ref={bottomRef} className="h-px" />
      </div>

      {showJump && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-md transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-850 dark:text-zinc-200 dark:hover:bg-ink-800"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Jump to latest
        </button>
      )}
    </div>
  )
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function MessageGroup({
  messages,
  isOwn,
  senderName,
}: {
  messages: ChatMessage[]
  isOwn: boolean
  senderName?: string
}) {
  return (
    <div className={cn('flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-semibold text-zinc-600 dark:border-ink-700 dark:bg-ink-800 dark:text-zinc-300"
          title={senderName}
          aria-hidden="true"
        >
          {getInitials(senderName)}
        </div>
      )}

      <div className={cn('flex max-w-[min(85%,28rem)] flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}>
        {!isOwn && senderName && (
          <span className="mb-0.5 px-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {senderName}
          </span>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg.message}
            isOwn={isOwn}
            createdAt={msg.created_at}
            showTimestamp={idx === messages.length - 1}
            readAt={msg.read_at}
            status={msg.status}
            isFirst={idx === 0}
            isLast={idx === messages.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  isOwn,
  createdAt,
  showTimestamp = true,
  readAt,
  status,
  isFirst,
  isLast,
}: {
  message: string
  isOwn: boolean
  createdAt: string
  showTimestamp?: boolean
  readAt?: string | null
  status?: ChatMessage['status']
  isFirst: boolean
  isLast: boolean
}) {
  const time = format(new Date(createdAt), 'h:mm a')
  const isFailed = status === 'failed'
  const isSending = status === 'sending'

  return (
    <div
      className={cn(
        'max-w-full px-3.5 py-2 text-sm shadow-sm transition-opacity',
        isOwn
          ? 'bg-brand text-white dark:bg-brand-secondary'
          : 'bg-zinc-100 text-zinc-900 dark:bg-ink-800 dark:text-zinc-100',
        isOwn
          ? cn(isFirst && 'rounded-tr-2xl', isLast ? 'rounded-br-md' : 'rounded-br-2xl', 'rounded-tl-2xl rounded-bl-2xl')
          : cn(isFirst && 'rounded-tl-2xl', isLast ? 'rounded-bl-md' : 'rounded-bl-2xl', 'rounded-tr-2xl rounded-br-2xl'),
        isSending && 'opacity-70',
        isFailed && 'ring-1 ring-red-400/60',
      )}
    >
      <p className="whitespace-pre-wrap break-words leading-relaxed [overflow-wrap:anywhere]">
        {message}
        {showTimestamp && (
          <span
            className={cn(
              'float-right ml-2 mt-[3px] inline-flex translate-y-[2px] select-none items-center gap-1 whitespace-nowrap',
              isOwn ? 'text-white/75' : 'text-zinc-500 dark:text-zinc-400',
            )}
          >
            <span className="text-[10px] tabular-nums">{time}</span>
            {isOwn && (
              <StatusTicks
                isSending={isSending}
                isFailed={isFailed}
                readAt={readAt}
              />
            )}
          </span>
        )}
      </p>
    </div>
  )
}

function StatusTicks({
  isSending,
  isFailed,
  readAt,
}: {
  isSending?: boolean
  isFailed?: boolean
  readAt?: string | null
}) {
  if (isFailed) {
    return (
      <svg className="h-3 w-3 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Failed">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  }
  if (isSending) {
    return (
      <svg className="h-3 w-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Sending">
        <circle cx="12" cy="12" r="3" strokeWidth={2} />
      </svg>
    )
  }
  if (readAt) {
    return (
      <svg className="h-3.5 w-3.5 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Read">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M1.5 12.5l4 4L12 9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16.5l1.5 1.5L17 9" />
      </svg>
    )
  }
  return (
    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Sent">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────

function MessageInput({
  onSend,
  disabled,
  disabledReason,
  footerHint,
}: {
  onSend: (message: string) => void
  disabled?: boolean
  disabledReason?: string
  footerHint?: string
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const remaining = MAX_LENGTH - value.length
  const nearLimit = remaining <= 100
  const canSend = value.trim().length > 0 && !disabled && value.length <= MAX_LENGTH

  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || trimmed.length > MAX_LENGTH) return
    onSend(trimmed)
    setValue('')
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.focus()
      }
    })
  }

  return (
    <div className="border-t border-zinc-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="flex items-end gap-2 p-3"
      >
        <div className="relative min-w-0 flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={disabled ? disabledReason || 'Messaging unavailable' : 'Type a message…'}
            disabled={disabled}
            rows={1}
            maxLength={MAX_LENGTH}
            className={cn(
              'max-h-[140px] min-h-[42px] w-full resize-none rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 pr-14 text-sm leading-5 text-zinc-900 placeholder:text-zinc-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-muted disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-950 dark:text-zinc-100 dark:placeholder:text-zinc-500',
            )}
            autoComplete="off"
            aria-label="Message"
          />
          {nearLimit && (
            <span
              className={cn(
                'pointer-events-none absolute bottom-2.5 right-3 text-[10px] tabular-nums',
                remaining < 0
                  ? 'text-red-500'
                  : remaining <= 30
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-zinc-400 dark:text-zinc-500',
              )}
            >
              {remaining}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!canSend}
          className="inline-flex h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-secondary dark:hover:opacity-90"
          aria-label="Send message"
        >
          <span className="hidden sm:inline">Send</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
      {(disabled && disabledReason) || footerHint ? (
        <p className="border-t border-zinc-100 px-3 py-2 text-[11px] text-zinc-400 dark:border-ink-800 dark:text-zinc-500">
          {disabled && disabledReason ? (
            disabledReason
          ) : (
            <>
              {footerHint}
              <span className="hidden sm:inline"> · Enter to send, Shift+Enter for a new line</span>
            </>
          )}
        </p>
      ) : (
        <p className="hidden border-t border-zinc-100 px-3 py-2 text-[11px] text-zinc-400 dark:border-ink-800 dark:text-zinc-500 sm:block">
          Enter to send · Shift+Enter for a new line
        </p>
      )}
    </div>
  )
}
