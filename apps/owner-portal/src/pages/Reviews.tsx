import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Skeleton, Select } from '@venue404/ui'
import type { SelectOption } from '@venue404/ui'
import { Pagination } from '../components/Pagination'
import {
  Star, MessageSquare, ChevronRight, TrendingUp, Building2,
  SlidersHorizontal
} from 'lucide-react'
import { createClient, venueEndpoints, reviewsEndpoints } from '@venue404/api-client'
import type { Review } from '@venue404/api-client'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
]
function avatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// ─── Star Display ─────────────────────────────────────────────────────────────

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'xs' }) {
  const cls = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${cls} fill-current ${i < rating ? 'text-amber-400' : 'text-zinc-200 dark:text-ink-700'}`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Review Row ───────────────────────────────────────────────────────────────

function ReviewRow({ review, venueName, onClick }: { review: Review; venueName: string; onClick: () => void }) {
  const name = review.user_name || 'Anonymous'
  return (
    <button
      onClick={onClick}
      className="w-full text-left group p-4 sm:p-5 bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700 hover:border-zinc-300 dark:hover:border-ink-600 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
        {getInitials(name)}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{name}</span>
          <Stars rating={review.rating} size="xs" />
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">{review.rating}.0</span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">{formatRelativeTime(review.created_at)}</span>
        </div>
        {review.title && (
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5">{review.title}</p>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{review.comment}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Building2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
          <span className="text-xs text-zinc-400 dark:text-zinc-500">{venueName}</span>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-ink-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 shrink-0 transition-colors" />
    </button>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-ink-700 rounded-2xl bg-zinc-50/40 dark:bg-ink-800/20">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-ink-800 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-ink-600" />
      </div>
      <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
        {filtered ? 'No reviews match your filters' : 'No reviews yet'}
      </h3>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 max-w-sm">
        {filtered
          ? 'Try adjusting the venue or rating filter.'
          : 'Once guests complete their bookings, their reviews will appear here.'}
      </p>
      {!filtered && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-3 py-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          Great reviews drive more bookings
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ReviewSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ReviewWithVenue = Review & { venue_name_display: string; venue_id_display: string }

export default function Reviews() {
  const navigate = useNavigate()
  const [venueFilter, setVenueFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')
  const [page, setPage] = useState(1)

  // Fetch all owner venues (lightweight options for the dropdown, excludes drafts)
  const { data: venueOptions, isLoading: venuesLoading } = useQuery({
    queryKey: ['my-venues-options'],
    queryFn: () => venueEndpoints(createClient()).getMyVenueOptions(),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch all reviews for this owner in one single API call!
  const reviewQueries = useQuery({
    queryKey: ['all-owner-reviews', venueFilter, ratingFilter, page],
    queryFn: async () => {
      const resp = await reviewsEndpoints(createClient()).getOwnerReviews({
        venue_id: venueFilter !== 'all' ? venueFilter : undefined,
        rating: ratingFilter !== 'all' ? ratingFilter : undefined,
        page,
        per_page: 25
      })
      const items = resp.items.map(r => ({
        ...r,
        venue_name_display: r.venue_name ?? 'Unknown Venue',
        venue_id_display: r.venue_id,
      })) as ReviewWithVenue[]
      return { ...resp, items }
    },
  })

  const reviews = reviewQueries.data?.items ?? []
  const totalReviews = reviewQueries.data?.total ?? 0
  const totalPages = reviewQueries.data?.total_pages ?? 1
  const isLoading = venuesLoading || reviewQueries.isLoading

  // Avg rating for current page only
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null

  const isFiltered = venueFilter !== 'all' || ratingFilter !== 'all'

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">

      {/* Summary stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700 p-4 shadow-sm">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Reviews</p>
          {isLoading
            ? <Skeleton className="h-7 w-12 mt-1" />
            : <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">{totalReviews}</p>}
        </div>
        {/* Avg rating */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700 p-4 shadow-sm">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Avg. Rating</p>
          {isLoading
            ? <Skeleton className="h-7 w-12 mt-1" />
            : <div className="flex items-center gap-1.5 mt-1">
                <svg className="w-5 h-5 fill-current text-amber-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {avgRating != null ? avgRating.toFixed(1) : '—'}
                </p>
              </div>}
        </div>
        {/* 5-star count */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700 p-4 shadow-sm">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">5-Star Reviews</p>
          {isLoading
            ? <Skeleton className="h-7 w-12 mt-1" />
            : <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {reviews.filter(r => r.rating === 5).length}
              </p>}
        </div>
        {/* Venues reviewed */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700 p-4 shadow-sm">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Venues Reviewed</p>
          {isLoading
            ? <Skeleton className="h-7 w-12 mt-1" />
            : <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                {new Set(reviews.map(r => r.venue_id_display)).size}
              </p>}
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          Filter by:
        </div>

        {/* Venue filter */}
        <Select
          value={venueFilter}
          onChange={v => {
            setVenueFilter(v)
            setPage(1)
          }}
          placeholder="All Venues"
          className="w-48"
          options={[
            { label: 'All Venues', value: 'all' },
            ...(venueOptions ?? []).map(v => ({ label: v.name, value: v.id }))
          ]}
        />

        {/* Rating filter */}
        <Select
          value={String(ratingFilter)}
          onChange={v => {
            setRatingFilter(v === 'all' ? 'all' : Number(v))
            setPage(1)
          }}
          placeholder="All Ratings"
          className="w-40"
          options={[
            { label: 'All Ratings', value: 'all' },
            { label: '★★★★★  5 Stars', value: '5' },
            { label: '★★★★☆  4 Stars', value: '4' },
            { label: '★★★☆☆  3 Stars', value: '3' },
            { label: '★★☆☆☆  2 Stars', value: '2' },
            { label: '★☆☆☆☆  1 Star',  value: '1' },
          ]}
        />

        {isFiltered && (
          <button
            onClick={() => { setVenueFilter('all'); setRatingFilter('all'); setPage(1) }}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <ReviewSkeleton key={i} />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState filtered={isFiltered} />
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <ReviewRow
              key={review.id}
              review={review}
              venueName={review.venue_name_display}
              onClick={() => navigate(`/reviews/${review.id}`, { state: { review, venueName: review.venue_name_display } })}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        page={page}
        perPage={25}
        total={reviewQueries.data?.total || 0}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  )
}
