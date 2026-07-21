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
    <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
      {/* Score chip */}
      <div className="flex shrink-0 items-center gap-5">
        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-amber-50 dark:bg-ink-800">
          <span className="text-2xl font-bold leading-none text-zinc-900 dark:text-zinc-100">
            {average_rating.toFixed(1)}
          </span>
          <div className="mt-1.5 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`h-2.5 w-2.5 ${
                  i < Math.round(average_rating)
                    ? 'fill-current text-amber-400'
                    : 'fill-current text-zinc-200 dark:text-ink-700'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400 sm:hidden">
          Based on {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-2.5">
        <div className="mb-1 hidden text-sm text-zinc-500 dark:text-zinc-400 sm:block">
          Based on {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
        </div>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = parseInt(String(rating_distribution[rating] || 0))
          const percentage = total_reviews > 0 ? (count / total_reviews) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex w-10 items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">{rating}</span>
                <svg className="h-3 w-3 fill-current text-amber-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-ink-800">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-6 text-right text-sm text-zinc-400">{count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
