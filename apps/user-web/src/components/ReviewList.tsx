import { Review } from '../types'
import { formatRelativeTime } from '../utils'
import { Skeleton } from '@venue404/ui'

interface ReviewListProps {
  reviews: Review[]
  isLoading?: boolean
  currentUserId?: string
  onEditClick?: (id: string, review: Review) => void
  onDeleteClick?: (id: string, review: Review) => void
}

function initials(name?: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Rotates through the same accent palette used elsewhere in the app
// (packages/ui/src/tokens.ts `accent`) so avatars feel on-brand rather
// than a random hash-to-color grab bag.
const AVATAR_PALETTE = [
  { bg: 'bg-brand-light dark:bg-ink-800', text: 'text-brand dark:text-brand-secondary' },
  { bg: 'bg-amber-50 dark:bg-ink-800', text: 'text-amber-600 dark:text-amber-400' },
  { bg: 'bg-violet-50 dark:bg-ink-800', text: 'text-violet-600 dark:text-violet-400' },
  { bg: 'bg-rose-50 dark:bg-ink-800', text: 'text-rose-600 dark:text-rose-400' },
]

function avatarStyle(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

export function ReviewList({
  reviews,
  isLoading = false,
  currentUserId,
  onEditClick,
  onDeleteClick,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-100 dark:border-ink-800 p-5">
            <div className="flex items-start gap-3.5">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2.5 pt-0.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 dark:border-ink-700 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 dark:bg-ink-800">
          <svg
            className="h-5 w-5 text-zinc-300 dark:text-ink-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No reviews yet — be the first to share your experience.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const canManage = !!currentUserId && review.user_id === currentUserId && !!review.id
        const palette = avatarStyle(review.user_name || review.user_id || 'x')

        return (
          <div
            key={review.id ?? `${review.user_id}-${review.created_at}`}
            className="card-enter rounded-2xl border border-zinc-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 transition-colors hover:border-zinc-200 dark:hover:border-ink-700"
          >
            <div className="flex items-start gap-3.5">
              {/* Avatar */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${palette.bg} ${palette.text}`}
              >
                {initials(review.user_name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {review.user_name || 'Anonymous'}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s < review.rating
                                ? 'fill-current text-amber-400'
                                : 'fill-current text-zinc-200 dark:text-ink-700'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-zinc-400">
                        {formatRelativeTime(review.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions — icon buttons instead of underlined text links */}
                  {canManage && (
                    <div className="flex shrink-0 items-center gap-1">
                      {onEditClick && (
                        <button
                          onClick={() => onEditClick(review.id, review)}
                          aria-label="Edit review"
                          className="press inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-brand dark:hover:bg-ink-800 dark:hover:text-brand-secondary"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.75}
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                            />
                          </svg>
                        </button>
                      )}
                      {onDeleteClick && (
                        <button
                          onClick={() => onDeleteClick(review.id, review)}
                          aria-label="Delete review"
                          className="press inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.75}
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {review.title && (
                  <h4 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {review.title}
                  </h4>
                )}

                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {review.comment}
                </p>

                {review.updated_at > review.created_at && (
                  <div className="mt-2.5 text-xs text-zinc-400">
                    Edited {formatRelativeTime(review.updated_at)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
