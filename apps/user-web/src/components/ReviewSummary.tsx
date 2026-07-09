import { ReviewSummary } from '../types'

interface ReviewSummaryProps {
  summary: ReviewSummary
}

export function ReviewSummaryComponent({ summary }: ReviewSummaryProps) {
  const { average_rating, total_reviews, rating_distribution } = summary

  if (total_reviews === 0) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        No reviews yet. Be the first to review this venue!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="flex items-end gap-5">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
            {average_rating.toFixed(1)}
          </span>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(average_rating)
                    ? 'text-amber-400 fill-current'
                    : 'text-zinc-200 dark:text-ink-700'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400 pb-1.5">
          Based on {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = parseInt(String(rating_distribution[rating] || 0))
          const percentage = total_reviews > 0 ? (count / total_reviews) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-10 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">{rating}</span>
                <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
              <div className="flex-1 h-2 bg-zinc-100 dark:bg-ink-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 w-8 text-right">{count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
