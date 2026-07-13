import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, Link } from 'react-router-dom'
import { Skeleton } from '@venue404/ui'
import { ArrowLeft, Star, MessageSquare, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { createClient, reviewsEndpoints } from '@venue404/api-client'
import type { Review, ReviewSummary } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Star Row ────────────────────────────────────────────────────────────────

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 fill-current ${i < rating ? 'text-amber-400' : 'text-zinc-200 dark:text-ink-700'}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Summary Panel ───────────────────────────────────────────────────────────

function SummaryPanel({ summary }: { summary: ReviewSummary }) {
  const { average_rating, total_reviews, rating_distribution } = summary

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 p-6 bg-white dark:bg-ink-900 rounded-2xl border border-zinc-200/80 dark:border-ink-700 shadow-sm">
      {/* Score chip */}
      <div className="flex flex-col items-center justify-center w-36 h-36 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 shrink-0 shadow-inner">
        <span className="text-5xl font-black text-zinc-900 dark:text-zinc-100 leading-none tabular-nums">
          {average_rating.toFixed(1)}
        </span>
        <div className="mt-2.5 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 fill-current ${i < Math.round(average_rating) ? 'text-amber-400' : 'text-zinc-200 dark:text-ink-700'}`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 w-full space-y-2.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = Number(rating_distribution[star] ?? 0)
          const pct = total_reviews > 0 ? (count / total_reviews) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-10 shrink-0">
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 tabular-nums">{star}</span>
                <svg className="w-3 h-3 fill-current text-amber-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
              <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-ink-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-7 text-right text-xs font-medium text-zinc-400 dark:text-zinc-500 tabular-nums">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Review Card ─────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const name = review.user_name || 'Anonymous'
  const isEdited = review.created_at !== review.updated_at

  return (
    <div className="p-5 bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
          >
            {getInitials(name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRow rating={review.rating} />
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{formatRelativeTime(review.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
          <svg className="w-3.5 h-3.5 fill-current text-amber-400" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tabular-nums">{review.rating}.0</span>
        </div>
      </div>

      <div className="mt-3 pl-[52px]">
        {review.title && (
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{review.title}</p>
        )}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{review.comment}</p>
        {isEdited && (
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500 italic">
            Edited {formatRelativeTime(review.updated_at)}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function NoReviews() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-zinc-200 dark:border-ink-700 rounded-2xl bg-zinc-50/40 dark:bg-ink-800/20">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-ink-800 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-ink-600" />
      </div>
      <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No reviews yet</h3>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 max-w-sm leading-relaxed">
        Once guests complete their bookings, their reviews will appear here.
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-3 py-1.5">
        <TrendingUp className="w-3.5 h-3.5" />
        Great reviews drive more bookings
      </div>
    </div>
  )
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function SummarySkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-8 p-6 bg-white dark:bg-ink-900 rounded-2xl border border-zinc-200/80 dark:border-ink-700">
      <Skeleton className="w-36 h-36 rounded-2xl shrink-0" />
      <div className="flex-1 w-full space-y-3 pt-2">
        {[5, 4, 3, 2, 1].map((s) => <Skeleton key={s} className="h-2 w-full rounded-full" />)}
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-5 bg-white dark:bg-ink-900 rounded-xl border border-zinc-200/80 dark:border-ink-700">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
          <div className="mt-3 pl-[52px] space-y-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PER_PAGE = 10

export default function VenueReviews() {
  const { venueId } = useParams<{ venueId: string }>()
  const [page, setPage] = useState(1)

  const portalTarget =
    typeof document !== 'undefined' ? document.getElementById('topbar-portal-target') : null

  const { data: summary, isLoading: summaryLoading } = useQuery<ReviewSummary>({
    queryKey: ['venue-review-summary', venueId],
    queryFn: () => reviewsEndpoints(createClient()).getRatingSummary(venueId!),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['venue-reviews', venueId, page],
    queryFn: () => reviewsEndpoints(createClient()).getVenueReviews(venueId!, page, PER_PAGE),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
  })

  const totalPages = listData ? Math.ceil(listData.total / PER_PAGE) : 1
  const hasReviews = (summary?.total_reviews ?? 0) > 0

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Back link via topbar portal */}
      {portalTarget &&
        createPortal(
          <Link
            to={`/venues/${venueId}/overview`}
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-zinc-50 dark:hover:bg-ink-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Link>,
          portalTarget
        )}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            Customer Reviews
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            What your guests are saying about their experience
          </p>
        </div>

        {hasReviews && summary && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 shadow-sm">
            <svg className="w-5 h-5 fill-current text-amber-400" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-lg font-black text-amber-700 dark:text-amber-400 tabular-nums">
              {summary.average_rating.toFixed(1)}
            </span>
            <span className="text-sm text-amber-600/70 dark:text-amber-500/70 font-medium">
              / 5 · {summary.total_reviews} {summary.total_reviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        )}
      </div>

      {/* Summary */}
      {summaryLoading ? (
        <SummarySkeleton />
      ) : summary && hasReviews ? (
        <SummaryPanel summary={summary} />
      ) : null}

      {/* Review List */}
      {listLoading ? (
        <ListSkeleton />
      ) : !hasReviews ? (
        <NoReviews />
      ) : (
        <>
          <div className="space-y-3">
            {(listData?.items ?? []).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-ink-800">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Page {page} of {totalPages} · {listData?.total} reviews total
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
