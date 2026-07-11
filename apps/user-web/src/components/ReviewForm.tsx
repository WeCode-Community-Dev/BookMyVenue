import { useState } from 'react'
import { Button, Alert } from '@venue404/ui'
import { Review } from '../types'

export interface ReviewFormSubmitData {
  /** null when creating a new review, otherwise the id of the review being edited */
  id: string | null
  rating: number
  title: string | null
  comment: string
}

interface ReviewFormProps {
  venueId: string
  onSubmit: (data: ReviewFormSubmitData) => Promise<void>
  onCancel?: () => void
  initialReview?: Review | null
  isSubmitting?: boolean
  isEligible?: boolean
  eligibilityReason?: string
}

export function ReviewForm({
  onSubmit,
  onCancel,
  initialReview,
  isSubmitting = false,
  isEligible = true,
  eligibilityReason = 'Complete a booking to review',
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(initialReview?.rating || 0)
  const [title, setTitle] = useState<string>(initialReview?.title || '')
  const [comment, setComment] = useState<string>(initialReview?.comment || '')
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!initialReview

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating < 1 || rating > 5) {
      setError('Please select a rating')
      return
    }

    if (!comment.trim()) {
      setError('Please write a comment')
      return
    }

    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters')
      return
    }

    if (isEditing && !initialReview?.id) {
      setError('Something went wrong loading this review. Please close and try editing again.')
      return
    }

    try {
      await onSubmit({
        id: initialReview?.id ?? null,
        rating,
        title: title || null,
        comment,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    }
  }

  if (!isEligible) {
    return (
      <div className="rounded-2xl border border-zinc-100 dark:border-ink-800 bg-zinc-50 dark:bg-ink-900 p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-ink-800">
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{eligibilityReason}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-enter rounded-2xl border border-zinc-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 sm:p-8"
    >
      <h3 className="mb-6 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {isEditing ? 'Update your review' : 'Share your experience'}
      </h3>

      <div className="space-y-6">
        {/* Rating */}
        <div>
          <label>
            Your rating <span className="text-red-500">*</span>
          </label>
          <div className="mt-1.5 flex gap-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                aria-label={`Rate ${r} star${r > 1 ? 's' : ''}`}
                className="press rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20"
              >
                <svg
                  className={`h-8 w-8 transition-colors ${
                    r <= rating
                      ? 'fill-current text-amber-400'
                      : 'fill-current text-zinc-200 dark:text-ink-700'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title">Title (optional)</label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Great venue for events"
            maxLength={255}
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment">
            Your experience <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... (minimum 10 characters)"
            maxLength={5000}
            rows={4}
            className="resize-none"
          />
          <div className="mt-1 text-xs text-zinc-400">{comment.length} / 5000 characters</div>
        </div>

        {/* Error */}
        {error && <Alert variant="destructive">{error}</Alert>}

        {/* Actions */}
        <div className="flex gap-3 border-t border-zinc-100 pt-5 dark:border-ink-800">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Submitting…' : isEditing ? 'Update review' : 'Post review'}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
