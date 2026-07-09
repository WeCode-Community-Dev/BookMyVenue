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
  venueId,
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

    // Validation
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

    // Editing an existing review but its id is missing — bail instead of
    // silently submitting `undefined` to the API. This is the case that used
    // to slip through: the parent tracked "which review is being edited" as
    // separate state from `initialReview`, and the two could fall out of
    // sync (e.g. a stale closure, or the reviews list refetching between
    // clicking Edit and submitting). Sourcing the id from `initialReview`
    // directly at submit time — and refusing to proceed if it's absent —
    // removes that failure mode entirely.
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
      <div className="rounded-xl border border-zinc-100 dark:border-ink-800 bg-zinc-50 dark:bg-ink-900 p-6 text-center">
        <svg
          className="w-12 h-12 text-zinc-300 dark:text-ink-600 mx-auto mb-3"
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
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{eligibilityReason}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6"
    >
      <div className="space-y-5">
        {/* Rating */}
        <div>
          <label>
            Your rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1.5 mt-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                aria-label={`Rate ${r} star${r > 1 ? 's' : ''}`}
                className="press rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20"
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    r <= rating ? 'text-amber-400 fill-current' : 'text-zinc-200 dark:text-ink-700'
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
          <div className="text-xs text-zinc-400 mt-1">{comment.length} / 5000 characters</div>
        </div>

        {/* Error */}
        {error && <Alert variant="destructive">{error}</Alert>}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
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
