import type { Review } from '@/services/reviewService';

interface ReviewListProps {
  isReviewsLoading: boolean;
  reviews: Review[];
  pagination: { totalPages: number; page: number; total: number } | null;
  fetchReviews: (venueId: string, page?: number) => void;
  id: string | undefined;
}

export function ReviewList({
  isReviewsLoading,
  reviews,
  pagination,
  fetchReviews,
  id,
}: ReviewListProps) {
  if (isReviewsLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bg-green)]"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-base text-[var(--text-secondary)] py-4">
        No reviews yet. Be the first to drop some genuine review in!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review._id}
          id={`review-${review._id}`}
          className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--bg-grey)]"
        >
          <div className="grid grid-cols-[2rem_1fr] gap-x-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-green)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {review.user.userName.charAt(0).toUpperCase()}
              </div>
              {review.ownerReply && <div className="w-0.5 flex-1 bg-[var(--bg-grey)] mt-1" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <p className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {review.user.userName}
                  </p>
                  {review.user.isVerified && (
                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-[10px] font-semibold rounded-full shrink-0">
                      Verified Customer
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {review.rating !== undefined && (
                    <span className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < (review.rating || 0) ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(review.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-[var(--text-primary)] mt-1 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>

            {review.ownerReply && (
              <>
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-1/2 w-[calc(50%+0.5rem)] h-[14px] border-l-2 border-b-2 border-[var(--bg-grey)] rounded-bl-xl -translate-x-[1px]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      O
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-[10px] font-semibold rounded-full">
                          Owner
                        </span>
                        <span className="text-xs text-[var(--text-secondary)] shrink-0">
                          {new Date(review.ownerReply.repliedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                        {review.ownerReply.text}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchReviews(id || '', i + 1)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pagination.page === i + 1
                  ? 'bg-[var(--bg-green)] text-white'
                  : 'bg-[var(--bg-grey)] text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]/30'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
