import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'

type Props = {
  venueType: string
  capacity: string
  instantBooking: boolean
  onVenueTypeChange: (type: string) => void
  onCapacityChange: (value: string) => void
  onInstantBookingChange: (value: boolean) => void
  onClearFilters: () => void
  hasFilters: boolean
  totalResults: number | null
}

export function SearchSidebar({
  venueType,
  capacity,
  instantBooking,
  onVenueTypeChange,
  onCapacityChange,
  onInstantBookingChange,
  onClearFilters,
  hasFilters,
}: Props) {
  // FIX #SearchSidebar: pull categories from the same API CategorySection uses,
  // instead of the hardcoded CATEGORIES constant which can drift out of sync
  const navigate = useNavigate()
  const { data: categories = [], isLoading: loadingCategories } = useCategories()

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Advanced filters</h3>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="cursor-pointer text-xs text-zinc-400 underline transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <p className="mb-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">Capacity</p>
        <input
          type="number"
          min={1}
          value={capacity}
          onChange={(e) => onCapacityChange(e.target.value)}
          placeholder="Number of people"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-100"
        />
      </div>

      <div>
        <p className="mb-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">Venue Type</p>
        {loadingCategories ? (
          <div className="flex flex-wrap gap-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-zinc-100 dark:bg-ink-800" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = venueType === c.slug
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onVenueTypeChange(active ? '' : c.slug)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${active
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800'
                    }`}
                >
                  {c.icon && <span className="mr-1">{c.icon}</span>}
                  {c.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">Booking Type</p>
        <button
          type="button"
          onClick={() => onInstantBookingChange(!instantBooking)}
          aria-pressed={instantBooking}
          className="flex w-full cursor-pointer items-center justify-between gap-3"
        >
          <span className="min-w-0">
            <span className="block text-sm text-zinc-700 dark:text-zinc-300">
              Instant Booking only
            </span>
          </span>

          <span
            role="switch"
            aria-checked={instantBooking}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${instantBooking ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-ink-700'
              }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${instantBooking ? 'translate-x-4' : 'translate-x-1'
                }`}
            />
          </span>
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
        <div className="mb-2 flex items-center gap-2">
          <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-sm font-bold text-white">Deep Research</span>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-zinc-400">
          Can't find the right venue? Our researchers will source every option — not just what's
          listed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/deep-research')}
          className="w-full cursor-pointer rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
        >
          Try Deep Research
        </button>
      </div>
    </div>
  )
}
