import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useAuthModal } from '../../lib/AuthModalContext'
import {
  useVenueReviews,
  useReviewSummary,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from '../../hooks/useReviews'
import { Review } from '../../types'
import { Button, Alert, Modal } from '@venue404/ui'
import { ReviewForm, ReviewFormSubmitData } from '../ReviewForm'
import { ReviewList } from '../ReviewList'
import { ReviewSummaryComponent } from '../ReviewSummary'

interface VenueReviewsProps {
  venueId: string
  userEligibleBookingIds?: string[]
}

export function VenueReviews({ venueId, userEligibleBookingIds = [] }: VenueReviewsProps) {
  const { user } = useAuth()
  const { openLogin } = useAuthModal()

  const {
    reviews,
    total,
    page,
    setPage,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useVenueReviews(venueId)
  const { summary, isLoading: summaryLoading } = useReviewSummary(venueId)
  const { createReview, isPending: isCreating } = useCreateReview(venueId)
  const { updateReview, isPending: isUpdating } = useUpdateReview()
  const { deleteReview, isPending: isDeleting } = useDeleteReview()

  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const hasEligibleBooking = userEligibleBookingIds && userEligibleBookingIds.length > 0
  const userAlreadyReviewed = user && reviews.some((r) => r.user_id === user.id)
  const canReview = user && hasEligibleBooking && !userAlreadyReviewed

  const handleSubmitReview = async ({ id, rating, title, comment }: ReviewFormSubmitData) => {
    if (!user) {
      openLogin()
      return
    }

    if (id) {
      await updateReview({ reviewId: id, rating, title, comment })
      setEditingReview(null)
    } else {
      await createReview({ rating, title, comment })
    }

    setShowForm(false)
    await refetchReviews()
  }

  const handleEditReview = (_id: string, review: Review) => {
    setEditingReview(review)
    setShowForm(true)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return
    await deleteReview(confirmDelete)
    setConfirmDelete(null)
    await refetchReviews()
  }

  return (
    <div className="space-y-6">
      {/* Header — one clear action on the right, not four competing states */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Reviews</h2>

        {!user ? (
          <Button variant="secondary" size="sm" onClick={openLogin}>
            Sign in to review
          </Button>
        ) : canReview && !showForm ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingReview(null)
              setShowForm(true)
            }}
          >
            Write a review
          </Button>
        ) : null}
      </div>

      {/* Summary card */}
      {summary && !summaryLoading && summary.total_reviews > 0 && (
        <div className="rounded-2xl border border-zinc-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 sm:p-8">
          <ReviewSummaryComponent summary={summary} />
        </div>
      )}

      {/* Status — informational only, the action lives in the header above */}
      {user && userAlreadyReviewed && (
        <Alert variant="success" className="text-center">
          You've reviewed this venue
        </Alert>
      )}
      {user && !hasEligibleBooking && !userAlreadyReviewed && (
        <Alert variant="info" className="text-center">
          Complete a booking to review this venue
        </Alert>
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          venueId={venueId}
          onSubmit={handleSubmitReview}
          onCancel={() => {
            setShowForm(false)
            setEditingReview(null)
          }}
          initialReview={editingReview}
          isSubmitting={isCreating || isUpdating}
          isEligible={canReview || !!editingReview}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {total} {total === 1 ? 'Review' : 'Reviews'}
        </h3>

        <ReviewList
          reviews={reviews}
          isLoading={reviewsLoading}
          currentUserId={user?.id}
          onEditClick={handleEditReview}
          onDeleteClick={(id) => setConfirmDelete(id)}
        />

        {/* Delete Confirmation */}
        <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} className="max-w-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Delete review?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 !bg-red-600 hover:!bg-red-700"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Pagination */}
        {total > 10 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Page {page} of {Math.ceil(total / 10)}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page * 10 >= total}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
