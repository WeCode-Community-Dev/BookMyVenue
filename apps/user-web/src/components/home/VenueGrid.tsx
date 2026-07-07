import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import type { SearchResult } from '../../types'
import { VENUE_TYPE_LABELS } from '../../constants'
import { VenueCard, VenueCardSkeleton } from './VenueCard'
import { SearchSidebar } from './SearchSidebar'

const PAGE_SIZE = 12

type SortKey = 'recommended' | 'price_asc' | 'price_desc' | 'capacity_desc'

function sortVenues(venues: SearchResult[], sort: SortKey): SearchResult[] {
  const copy = [...venues]
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => (a.starting_price_paise ?? 0) - (b.starting_price_paise ?? 0))
    case 'price_desc':
      return copy.sort((a, b) => (b.starting_price_paise ?? 0) - (a.starting_price_paise ?? 0))
    case 'capacity_desc':
      return copy.sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0))
    default:
      return copy
  }
}

type Props = {
  venues: SearchResult[]
  total: number | null
  loading: boolean
  error: string | null
  hasFilters: boolean
  venueType: string
  capacity: string
  onVenueClick: (id: string) => void
  onRetry: () => void
  onClearFilters: () => void
  onVenueTypeChange: (type: string) => void
  onCapacityChange: (value: string) => void
}

function Breadcrumbs() {
  const [params] = useSearchParams()
  const city = params.get('city')
  const venueType = params.get('venue_type')
  const q = params.get('q')

  const crumbs: { label: string; href?: string }[] = [{ label: 'Home', href: '/' }]
  if (city) crumbs.push({ label: city })
  if (venueType) crumbs.push({ label: VENUE_TYPE_LABELS[venueType] ?? venueType })
  else if (q) crumbs.push({ label: `"${q}"` })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-zinc-400">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-zinc-300">&rsaquo;</span>}
          {crumb.href ? (
            <Link to={crumb.href} className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

// FIX #originally reported bug: this heading reads straight from URL params,
// which is correct — the "1 result for 'm'" bug was actually caused by the
// hasFilters/draft-state desync in Home.tsx (now fixed there). No change
// needed here once Home.tsx only commits searchParams on submit.
function ResultsHeading({ total, loading }: { total: number | null; loading: boolean }) {
  const [params] = useSearchParams()
  const city = params.get('city')
  const venueType = params.get('venue_type')
  const q = params.get('q')

  const typeLabel = venueType ? (VENUE_TYPE_LABELS[venueType] ?? venueType) : ''
  const parts = [typeLabel ? `${typeLabel} venues` : 'venues', city ? `in ${city}` : ''].filter(
    Boolean
  )
  const suffix = parts.join(' ')
  const label = q && !typeLabel ? `results for "${q}"` : suffix

  if (loading) return <div className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-ink-800" />

  return (
    <h2 className="mb-6 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
      {(total ?? 0) > 0 ? (
        <>
          {total} {label}
        </>
      ) : (
        <>No {label} found</>
      )}
    </h2>
  )
}

function FilterToggle({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
        />
      </svg>
      Filters
      {count > 0 && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  )
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center dark:border-ink-700">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-ink-800">
        <svg
          className="h-6 w-6 text-zinc-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No venues found</p>
      <p className="mt-1.5 max-w-xs text-sm text-zinc-400">
        Try adjusting your filters or searching a different location.
      </p>
      <button
        onClick={onClearFilters}
        className="mt-6 cursor-pointer rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
      >
        Clear all filters
      </button>
    </div>
  )
}

export function VenueGrid({
  venues,
  total,
  loading,
  error,
  hasFilters,
  venueType,
  capacity,
  onVenueClick,
  onRetry,
  onClearFilters,
  onVenueTypeChange,
  onCapacityChange,
}: Props) {
  const [searchParams] = useSearchParams()
  const [sort, setSort] = useState<SortKey>('recommended')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // FIX #3: reset to page 1 whenever the *committed* search query changes
  // (new q/city/venue_type/capacity submitted) — previously only sort/filter
  // wrapper functions reset the page, so a fresh search from the hero could
  // leave you stranded on an out-of-range page with an empty grid.
  useEffect(() => {
    setPage(1)
  }, [searchParams.toString()])

  const activeFilterCount = [venueType, capacity].filter(Boolean).length
  const sorted = useMemo(() => sortVenues(venues, sort), [venues, sort])
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(next: SortKey) {
    setSort(next)
    setPage(1)
  }

  const sidebarProps = {
    venueType,
    capacity,
    onVenueTypeChange: (t: string) => {
      onVenueTypeChange(t)
      setPage(1)
      setMobileFiltersOpen(false) // FIX #7: auto-close drawer after picking a filter
    },
    onCapacityChange: (v: string) => {
      onCapacityChange(v)
      setPage(1)
    },
    onClearFilters: () => {
      onClearFilters()
      setMobileFiltersOpen(false)
    },
    hasFilters,
    totalResults: total,
  }

  return (
    <div className="bg-white dark:bg-ink-950">
      <div className="border-b border-zinc-100 bg-white px-6 py-3.5 dark:border-ink-800 dark:bg-ink-950">
        <div className="mx-auto max-w-7xl px-6">
          <Breadcrumbs />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-6">
              <SearchSidebar {...sidebarProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <ResultsHeading total={total} loading={loading} />

            <div className="mb-5 flex items-center justify-between gap-3">
              <FilterToggle
                onClick={() => setMobileFiltersOpen((v) => !v)}
                count={activeFilterCount}
              />

              <div className="flex items-center gap-2 ml-auto">
                <span className="hidden text-xs text-zinc-400 sm:block">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => handleSort(e.target.value as SortKey)}
                  className="rounded-xl border border-zinc-200 bg-white py-2 pl-3.5 text-sm text-zinc-700 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="capacity_desc">Largest first</option>
                </select>
              </div>
            </div>

            {mobileFiltersOpen && (
              <div className="mb-6 lg:hidden">
                <SearchSidebar {...sidebarProps} />
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center dark:border-red-900/50 dark:bg-red-950/30">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={onRetry}
                  className="mt-4 cursor-pointer rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:bg-ink-900 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {loading && Array.from({ length: 9 }).map((_, i) => <VenueCardSkeleton key={i} />)}

              {!loading && !error && venues.length === 0 && (
                <EmptyState onClearFilters={onClearFilters} />
              )}

              {!loading &&
                !error &&
                paged.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} onClick={() => onVenueClick(venue.id)} />
                ))}
            </div>

            {!loading && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1
                  const isActive = p === page
                  const show = isActive || Math.abs(p - page) <= 1 || p === 1 || p === totalPages
                  if (!show) {
                    if (p === 2 || p === totalPages - 1)
                      return (
                        <span key={p} className="text-sm text-zinc-400">
                          …
                        </span>
                      )
                    return null
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
