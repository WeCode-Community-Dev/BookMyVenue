import { useState } from 'react'
import type { Amenity } from '../../types'

type Props = { amenities: Amenity[] }

const SHOW_LIMIT = 8

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function AmenitiesList({ amenities }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (amenities.length === 0) {
    return (
      <div>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">What this venue offers</h2>
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-8 text-center dark:border-ink-700 dark:bg-ink-900">
          <div className="mb-2 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-ink-800">
              <svg className="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-zinc-400 italic">No amenities listed yet.</p>
        </div>
      </div>
    )
  }

  const visible = expanded ? amenities : amenities.slice(0, SHOW_LIMIT)
  const hasMore = amenities.length > SHOW_LIMIT

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">What this venue offers</h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {visible.map((a) => (
          <div key={a.id} className="flex items-center gap-3.5 text-sm text-zinc-700 dark:text-zinc-300">
            {a.icon ? (
              <span className="shrink-0 text-lg leading-none">{a.icon}</span>
            ) : (
              <CheckIcon />
            )}
            <span className="line-clamp-1">{a.name}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 active:scale-[0.97] dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
        >
          {expanded ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Show fewer amenities
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show all {amenities.length} amenities
            </>
          )}
        </button>
      )}
    </div>
  )
}
