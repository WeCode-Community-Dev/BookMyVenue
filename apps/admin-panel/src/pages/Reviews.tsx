import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, StarOff, EyeOff, Eye, Trash2, MessageSquare, StarHalf } from 'lucide-react'
import { createClient, reviewsEndpoints } from '@venue404/api-client'
import type { Review } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  MetricCard, SectionHeader, StatusBadge, EmptyState,
  LoadingScreen, ErrorState, Button, Modal,
} from '@venue404/ui'

const api = reviewsEndpoints(createClient())

const PAGE_SIZE = 20

type VisibilityFilter = '' | 'visible' | 'hidden'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        i < rating
          ? <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          : <StarOff key={i} className="h-3.5 w-3.5 text-zinc-200" />
      ))}
    </div>
  )
}

export default function Reviews() {
  const qc = useQueryClient()

  const [page, setPage] = useState(1)
  const [ratingFilter, setRatingFilter] = useState<number | ''>('')
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('')

  const [hideTarget, setHideTarget] = useState<Review | null>(null)
  const [hideReason, setHideReason] = useState('')
  const [restoreTarget, setRestoreTarget] = useState<Review | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)

  // ── Query ───────────────────────────────────────────────────────────────────

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'reviews', { page, rating: ratingFilter, visibility: visibilityFilter }],
    queryFn: () => api.listAllReviews(
      {
        rating: ratingFilter || undefined,
        is_hidden: visibilityFilter === 'hidden' ? true : visibilityFilter === 'visible' ? false : undefined,
      },
      page,
      PAGE_SIZE,
    ),
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const stats = data?.stats ?? null
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasFilters = !!(ratingFilter || visibilityFilter)

  const invalidateReviews = () => qc.invalidateQueries({ queryKey: ['admin', 'reviews'] })

  // ── Mutations ───────────────────────────────────────────────────────────────

  const hideMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => api.hideReview(id, reason),
    onSuccess: () => { invalidateReviews(); closeHide() },
  })

  const restoreMutation = useMutation({
    mutationFn: (id: string) => api.restoreReview(id),
    onSuccess: () => { invalidateReviews(); closeRestore() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteReviewAdmin(id),
    onSuccess: () => { invalidateReviews(); closeDelete() },
  })

  function closeHide()    { setHideTarget(null);    setHideReason(''); hideMutation.reset() }
  function closeRestore() { setRestoreTarget(null);  restoreMutation.reset() }
  function closeDelete()  { setDeleteTarget(null);   deleteMutation.reset() }

  function handleHide() {
    if (!hideTarget) return
    hideMutation.mutate({ id: hideTarget.id, reason: hideReason.trim() || undefined })
  }

  function handleRestore() {
    if (!restoreTarget) return
    restoreMutation.mutate(restoreTarget.id)
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id)
  }

  return (
    <AdminLayout pageTitle="Ratings & Reviews" pageSubtitle="Moderate venue reviews and ratings">

      {/* Metric strip */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Reviews',  value: stats?.total,           description: 'All non-deleted reviews',        accent: 'brand' as const,   icon: <MessageSquare className="h-4 w-4" /> },
          { label: 'Visible',        value: stats?.visible,         description: 'Shown publicly on venue pages',  accent: 'emerald' as const, icon: <Eye className="h-4 w-4" /> },
          { label: 'Hidden',         value: stats?.hidden,          description: 'Moderated out of public view',   accent: 'amber' as const,   icon: <EyeOff className="h-4 w-4" /> },
          { label: 'Average Rating', value: stats?.average_rating,  description: 'Across all reviews, out of 5',   accent: 'rose' as const,    icon: <StarHalf className="h-4 w-4" /> },
        ].map((m, i) => (
          <div key={m.label} className="card-enter" style={{ '--index': i } as React.CSSProperties}>
            <MetricCard
              label={m.label}
              value={m.value !== undefined ? String(m.value) : '—'}
              description={m.description}
              icon={m.icon}
              accent={m.accent}
            />
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm" style={{ '--index': 4 } as React.CSSProperties}>

        {/* Header + filters */}
        <div className="border-b border-zinc-100 px-5 py-4">
          <SectionHeader
            title="All reviews"
            description={
              !isLoading
                ? `${total} ${total === 1 ? 'review' : 'reviews'}${hasFilters ? ' matching filters' : ''}`
                : undefined
            }
          />

          <div className="mt-3 flex flex-wrap items-end gap-2">
            <div className="min-w-[140px]">
              <select
                value={ratingFilter}
                onChange={(e) => { setRatingFilter(e.target.value ? Number(e.target.value) : ''); setPage(1) }}
              >
                <option value="">All ratings</option>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} star{r === 1 ? '' : 's'}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[140px]">
              <select
                value={visibilityFilter}
                onChange={(e) => { setVisibilityFilter(e.target.value as VisibilityFilter); setPage(1) }}
              >
                <option value="">All statuses</option>
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content states */}
        {isLoading && (
          <div className="px-5 py-10">
            <LoadingScreen message="Loading reviews…" fullScreen={false} />
          </div>
        )}

        {!isLoading && error && (
          <div className="px-5 py-10">
            <ErrorState
              title="Could not load reviews"
              message={error instanceof Error ? error.message : 'Failed to load reviews'}
              fullScreen={false}
              action={<Button variant="secondary" onClick={invalidateReviews}>Retry</Button>}
            />
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="px-5 py-10">
            <EmptyState
              icon={<MessageSquare className="h-4 w-4" />}
              title="No reviews found"
              description={hasFilters ? 'Try adjusting the filters.' : 'No reviews have been submitted yet.'}
            />
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/60">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Venue</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Reviewer</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Rating</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Comment</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Date</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {items.map((review) => (
                    <tr key={review.id} className="transition-colors hover:bg-zinc-50/70">
                      <td className="px-5 py-3.5">
                        <div className="max-w-[160px] truncate font-medium text-zinc-900">
                          {review.venue_name ?? '—'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="min-w-0 max-w-[180px]">
                          <div className="truncate font-medium text-zinc-900">{review.user_name ?? '—'}</div>
                          <div className="truncate text-xs text-zinc-400">{review.user_email ?? '—'}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><StarRating rating={review.rating} /></td>
                      <td className="px-5 py-3.5">
                        <div className="max-w-[260px] truncate text-zinc-600" title={review.comment}>
                          {review.comment}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          label={review.is_hidden ? 'Hidden' : 'Visible'}
                          variant={review.is_hidden ? 'danger' : 'success'}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-400">
                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {review.is_hidden ? (
                            <button
                              type="button"
                              onClick={() => setRestoreTarget(review)}
                              className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setHideTarget(review)}
                              className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50"
                            >
                              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                              Hide
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(review)}
                            className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
                <span>
                  {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="press rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="tabular-nums">Page {page} of {totalPages}</span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="press rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hide Modal */}
      <Modal open={hideTarget !== null} onClose={closeHide}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-900/5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
              <EyeOff className="h-5 w-5 text-amber-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Hide review</h3>
            <p className="mb-5 text-sm text-zinc-500">
              This review by <span className="font-medium text-zinc-800">{hideTarget?.user_name ?? hideTarget?.user_email ?? 'this user'}</span>{' '}
              will be removed from public view immediately. It can be restored later.
            </p>
            <div>
              <label htmlFor="hide-reason">
                Reason <span className="font-normal text-zinc-400 text-xs">(optional)</span>
              </label>
              <input
                id="hide-reason"
                type="text"
                placeholder="e.g. Contains offensive language"
                value={hideReason}
                onChange={(e) => { setHideReason(e.target.value); hideMutation.reset() }}
                autoFocus
              />
              {hideMutation.error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {hideMutation.error instanceof Error ? hideMutation.error.message : 'Failed to hide review'}
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeHide} disabled={hideMutation.isPending}>Cancel</Button>
              <button
                type="button"
                onClick={handleHide}
                disabled={hideMutation.isPending}
                className="press rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-50"
              >
                {hideMutation.isPending ? 'Hiding…' : 'Hide review'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Restore Modal */}
      <Modal open={restoreTarget !== null} onClose={closeRestore}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-900/5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <Eye className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Restore review</h3>
            <p className="mb-5 text-sm text-zinc-500">
              This review will become publicly visible again immediately.
            </p>
            {restoreMutation.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {restoreMutation.error instanceof Error ? restoreMutation.error.message : 'Failed to restore review'}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeRestore} disabled={restoreMutation.isPending}>Cancel</Button>
              <button
                type="button"
                onClick={handleRestore}
                disabled={restoreMutation.isPending}
                className="press rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {restoreMutation.isPending ? 'Restoring…' : 'Restore review'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteTarget !== null} onClose={closeDelete}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-900/5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Delete review</h3>
            <p className="mb-5 text-sm text-zinc-500">
              This will permanently delete this review. This action cannot be undone — consider
              hiding it instead if you may want to restore it later.
            </p>
            {deleteMutation.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Failed to delete review'}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeDelete} disabled={deleteMutation.isPending}>Cancel</Button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

    </AdminLayout>
  )
}
