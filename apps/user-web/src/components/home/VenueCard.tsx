import { formatPrice } from '../../utils'
import type { SearchResult } from '../../types'
import { useLikes } from '../../lib/useLikes'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

type Props = { venue: SearchResult; onClick: () => void }

export function VenueCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] animate-pulse">
      <div className="aspect-[4/3] bg-zinc-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 w-3/4 rounded bg-zinc-100" />
        <div className="h-3 w-1/2 rounded bg-zinc-100" />
        <div className="h-3 w-2/5 rounded bg-zinc-100" />
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-4/5 rounded bg-zinc-100" />
      </div>
    </div>
  )
}

export function VenueCard({ venue, onClick }: Props) {
  const typeLabel = venue.category?.label ?? venue.category?.slug ?? ''

  // FIX #4: match TrendingCard's pricing-mode-aware label instead of
  // a flat "min spend" string for everything
  const unitSuffix =
    venue.pricing_mode === 'flat' ? ' / day' : venue.pricing_mode === 'hourly' ? ' / hr' : ''

  // When the venue has active dynamic-pricing rules, show the actual achievable
  // range instead of the flat base price (PRD §6.6).
  const hasDisplayRange =
    venue.display_price_min_paise != null &&
    venue.display_price_max_paise != null &&
    venue.display_price_min_paise !== venue.display_price_max_paise

  const priceLabel = hasDisplayRange
    ? `${formatPrice(venue.display_price_min_paise!)} – ${formatPrice(venue.display_price_max_paise!)}${unitSuffix}`
    : venue.starting_price_paise != null
      ? `From ${formatPrice(venue.starting_price_paise)}${unitSuffix}`
      : null

  const { isLiked, toggleLike } = useLikes()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const liked = isLiked(venue.id)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    toggleLike(venue.id)
  }

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
      className="group cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-2xl"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[8/5] overflow-hidden rounded-2xl bg-zinc-100">
        {venue.cover_photo_url ? (
          <img
            src={venue.cover_photo_url}
            alt={venue.name}
            // FIX #1: the missing space had merged duration-500 + rounded-2xl
            // into an invalid class — neither rule was applying
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-100 to-zinc-50">
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
            <p className="px-4 text-center text-xs leading-tight text-zinc-400 line-clamp-2">
              {venue.name}
            </p>
          </div>
        )}

        {venue.booking_mode === 'INSTANT' && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 shadow-sm">
              Instant Booking
            </span>
          </div>
        )}

        <button
          onClick={handleLike}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
          aria-label={liked ? 'Unsave venue' : 'Save venue'}
        >
          <svg
            className={`h-4 w-4 transition-colors ${liked ? 'text-red-500' : 'text-zinc-400 hover:text-red-400'}`}
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={liked ? 1 : 1.75}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* ── Info ── */}
      <div className="py-3 px-1">
        <h5 className="truncate font-medium text-zinc-900 leading-snug transition-colors group-hover:text-brand">
          {venue.name}
        </h5>

        <p className="text-[.8rem] text-zinc-500">
          {venue.city}
          {venue.capacity != null && <> &middot; Up to {venue.capacity.toLocaleString()} guests</>}
        </p>

        {priceLabel && <p className="mt-1.5 text-sm font-semibold text-zinc-900">{priceLabel}</p>}

        <p className="mt-1.5 text-[.8rem] text-zinc-400 line-clamp-2">
          A {typeLabel.toLowerCase()} venue in {venue.city}. Available for events, conferences, and
          private hire.
        </p>
      </div>
    </article>
  )
}
