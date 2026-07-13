import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@venue404/ui'
import {
  ArrowLeft, Star, Building2, CalendarDays, User, MessageSquare, Clock
} from 'lucide-react'
import { createClient, reviewsEndpoints } from '@venue404/api-client'
import type { Review } from '@venue404/api-client'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

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

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 fill-current ${i < rating ? 'text-amber-400' : 'text-zinc-200 dark:text-ink-700'}`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-ink-800 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-ink-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewDetail() {
  const { reviewId } = useParams<{ reviewId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  // Try state first (fast path from list), fallback to API
  const stateReview = location.state?.review as Review | undefined
  const stateVenueName = location.state?.venueName as string | undefined

  const { data: fetchedReview, isLoading } = useQuery<Review>({
    queryKey: ['review', reviewId],
    queryFn: () => reviewsEndpoints(createClient()).getReview(reviewId!),
    enabled: !!reviewId && !stateReview,
    staleTime: 5 * 60 * 1000,
  })

  const review = stateReview ?? fetchedReview
  const loading = !stateReview && isLoading

  const name = review?.user_name || 'Anonymous'
  const isEdited = review && review.created_at !== review.updated_at

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/reviews')}
        className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Reviews
      </button>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : !review ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-ink-700 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-zinc-300 dark:text-ink-600 mb-3" />
          <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">Review not found</p>
          <p className="text-sm text-zinc-400 mt-1">It may have been deleted.</p>
        </div>
      ) : (
        <>
          {/* Hero card */}
          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-zinc-200/80 dark:border-ink-700 shadow-sm overflow-hidden">
            {/* Header gradient */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/5 border-b border-amber-100/60 dark:border-amber-900/30 p-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-white text-lg font-black shrink-0 shadow-md`}>
                  {getInitials(name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <StarDisplay rating={review.rating} />
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400 tabular-nums">{review.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review body */}
            <div className="p-6 space-y-4">
              {review.title && (
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{review.title}</h3>
              )}
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-7 whitespace-pre-wrap">{review.comment}</p>
              {isEdited && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Edited {formatRelativeTime(review.updated_at)}
                </p>
              )}
            </div>
          </div>

          {/* Meta card */}
          <div className="bg-white dark:bg-ink-900 rounded-2xl border border-zinc-200/80 dark:border-ink-700 shadow-sm p-6">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Review Details</h4>
            <div className="divide-y divide-zinc-100 dark:divide-ink-800">
              <InfoRow icon={User} label="Reviewer" value={name} />
              <InfoRow icon={Building2} label="Venue" value={stateVenueName ?? review.venue_name ?? 'Unknown Venue'} />
              <InfoRow icon={CalendarDays} label="Submitted" value={formatDate(review.created_at)} />
              {isEdited && (
                <InfoRow icon={Clock} label="Last Edited" value={formatDate(review.updated_at)} />
              )}
              <InfoRow
                icon={Star}
                label="Booking Reference"
                value={review.booking_id ? `#${review.booking_id.slice(0, 8).toUpperCase()}` : 'N/A'}
              />
            </div>
          </div>

          {/* Hidden badge */}
          {review.is_hidden && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              This review has been hidden and is not publicly visible.
              {review.hidden_reason && <span className="text-rose-500">Reason: {review.hidden_reason}</span>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
