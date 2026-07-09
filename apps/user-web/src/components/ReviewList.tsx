import { Review } from '../types'
import { formatRelativeTime } from '../utils'
import { Skeleton } from '@venue404/ui'

interface ReviewListProps {
  reviews: Review[]
  isLoading?: boolean
  currentUserId?: string
  // Now takes the review id explicitly, rather than requiring the parent to
  // pull `.id` off the review object itself. Paired with the guard below,
  // this makes it impossible to wire an edit/delete action up to a review
  // that doesn't actually have an id yet.
  onEditClick?: (id: string, review: Review) => void
  onDeleteClick?: (id: string, review: Review) => void
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
          <div key={i} className="rounded-xl border border-zinc-100 dark:border-ink-800 p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
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
      <div className="text-center py-10 rounded-xl border border-dashed border-zinc-200 dark:border-ink-700 text-sm text-zinc-500 dark:text-zinc-400">
        No reviews yet. Be the first to share your experience!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        // Only surface edit/delete for the review's own author, and only
        // once we know it actually has an id — this is what used to let
        // clicks fire with an undefined id against the API.
        const canManage = !!currentUserId && review.user_id === currentUserId && !!review.id

        return (
          <div
            key={review.id ?? `${review.user_id}-${review.created_at}`}
            className="card-enter rounded-xl border border-zinc-100 dark:border-ink-800 p-4 hover:border-zinc-200 dark:hover:border-ink-700 transition-colors"
          >
            {/* Header: Author, Rating, Date */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {review.user_name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? 'text-amber-400 fill-current'
                            : 'text-zinc-200 dark:text-ink-700'
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

              {/* Action buttons - visible only for own reviews with a valid id */}
              {canManage && (
                <div className="flex gap-3 shrink-0">
                  {onEditClick && (
                    <button
                      onClick={() => onEditClick(review.id, review)}
                      className="text-xs font-medium text-brand hover:text-brand-hover dark:text-brand-secondary transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDeleteClick && (
                    <button
                      onClick={() => onDeleteClick(review.id, review)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            {review.title && (
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                {review.title}
              </h4>
            )}

            {/* Comment */}
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {review.comment}
            </p>

            {/* Edit indicator */}
            {review.updated_at > review.created_at && (
              <div className="text-xs text-zinc-400 mt-2">
                Edited {formatRelativeTime(review.updated_at)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
