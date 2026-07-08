// Placeholder reviews section — wire to real review API when available

const PLACEHOLDER_RATING = null // null = no reviews yet

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className={`h-5 w-5 ${filled ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-300 dark:text-zinc-700'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}

export function VenueReviews() {
  if (PLACEHOLDER_RATING !== null) {
    // Future: render real reviews here
    return null
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={false} />
          ))}
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">No reviews yet</h2>
      </div>

      {/* Empty state card */}
      <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-8 py-12 text-center dark:border-ink-800 dark:bg-ink-900">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-ink-800">
          <svg className="h-7 w-7 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Be the first to review</h3>
        <p className="mt-2 max-w-xs mx-auto text-sm text-zinc-500 leading-relaxed">
          This venue hasn't been reviewed yet. Book it and share your experience with the community.
        </p>
      </div>

      {/* Category placeholders */}
      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
        {['Cleanliness', 'Accuracy', 'Value', 'Location', 'Communication', 'Check-in'].map((cat) => (
          <div key={cat} className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{cat}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-zinc-100 overflow-hidden dark:bg-ink-800">
                <div className="h-full w-0 bg-zinc-300 rounded-full dark:bg-ink-600" />
              </div>
              <span className="text-xs text-zinc-400 w-4">–</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
