import { formatPrice } from '../../utils'
import type { SearchResult } from '../../types'

const MAX_TRENDING = 8

type Props = {
  venues:       SearchResult[]
  loading:      boolean
  onVenueClick: (id: string) => void
  onViewAll:    () => void
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TrendingSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-zinc-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 w-3/4 rounded bg-zinc-100" />
        <div className="h-3 w-1/2 rounded bg-zinc-100" />
        <div className="mt-3 flex items-center justify-between border-t border-zinc-50 pt-3">
          <div className="h-3 w-1/3 rounded bg-zinc-100" />
          <div className="h-3 w-1/4 rounded bg-zinc-100" />
        </div>
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function TrendingCard({ venue, onClick }: { venue: SearchResult; onClick: () => void }) {
  const typeLabel = venue.category?.label ?? venue.category?.slug ?? ''

  const unitSuffix =
    venue.pricing_mode === 'flat' ? ' / day' : venue.pricing_mode === 'hourly' ? ' / hr' : ''

  const hasDisplayRange =
    venue.display_price_min_paise != null &&
    venue.display_price_max_paise != null &&
    venue.display_price_min_paise !== venue.display_price_max_paise

  const priceLabel = hasDisplayRange
    ? `${formatPrice(venue.display_price_min_paise!)} – ${formatPrice(venue.display_price_max_paise!)}${unitSuffix}`
    : venue.starting_price_paise != null
      ? `From ${formatPrice(venue.starting_price_paise)}${unitSuffix}`
      : 'Price on request'

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {venue.cover_photo_url ? (
          <img
            src={venue.cover_photo_url}
            alt={venue.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-zinc-100 to-zinc-50">
            <svg
              className="h-9 w-9 text-zinc-300"
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
            <p className="px-6 text-center text-xs leading-relaxed text-zinc-400 line-clamp-2">
              {venue.name}
            </p>
          </div>
        )}

        {/* Venue type pill */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 shadow-sm backdrop-blur-sm">
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="truncate text-sm font-semibold text-zinc-900 transition-colors group-hover:text-brand">
          {venue.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-zinc-400">{venue.city}</p>

        <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
          <span className="text-xs text-zinc-400">
            {venue.capacity ? `Up to ${venue.capacity.toLocaleString()} guests` : '—'}
          </span>
          <span className="text-xs font-semibold text-zinc-900">{priceLabel}</span>
        </div>
      </div>
    </article>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function TrendingVenuesSection({ venues, loading, onVenueClick, onViewAll }: Props) {
  const trending = venues.slice(0, MAX_TRENDING)

  return (
    <section className="border-t border-zinc-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Trending venues
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Hand-picked from across India</p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-colors hover:border-brand/30 hover:text-brand"
          >
            View all
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <TrendingSkeleton key={i} />)}
          </div>
        ) : trending.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((venue) => (
              <TrendingCard
                key={venue.id}
                venue={venue}
                onClick={() => onVenueClick(venue.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
            <svg className="mb-3 h-8 w-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm font-medium text-zinc-500">No venues yet · check back soon</p>
          </div>
        )}
      </div>
    </section>
  )
}
