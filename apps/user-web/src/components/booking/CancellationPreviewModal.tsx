import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { createClient, bookingEndpoints } from '@venue404/api-client'

import type { BookingOut, CancellationPreviewOut } from '../../types'

import { formatPrice } from '../../utils'

type Props = {
  booking: BookingOut
  open: boolean
  onClose: () => void
}

export function CancellationPreviewModal({ booking, open, onClose }: Props) {
  const client = createClient()
  const queryClient = useQueryClient()

  const previewQuery = useQuery({
    queryKey: ['cancel-preview', booking.id],
    queryFn: () => bookingEndpoints(client).getCancellationPreview(booking.id),
    enabled: open,
  })

  const cancelMutation = useMutation({
    mutationFn: () => bookingEndpoints(client).cancelBooking(booking.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['booking', booking.id] })
      onClose()
    },
  })

  if (!open) {
    return null
  }

  const preview = previewQuery.data as CancellationPreviewOut | undefined

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="page-enter w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-ink-800 dark:bg-ink-900">
          {/* Header */}
          <div className="border-b border-zinc-200 px-6 py-5 dark:border-ink-800">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z"
                  />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Cancel booking
                </h2>
                <p className="text-sm text-zinc-500">Review refund details before confirming.</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {previewQuery.isLoading && (
              <div className="space-y-4">
                <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
                <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
                <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
              </div>
            )}

            {previewQuery.isError && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                <p className="text-sm text-red-700 dark:text-red-400">
                  Unable to calculate cancellation refund.
                </p>
              </div>
            )}

            {preview && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 dark:border-ink-800 sm:grid-cols-2">
                  <div className="p-4">
                    <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                      Refund amount
                    </div>
                    <div className="mt-1 text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                      {formatPrice(preview.refund_amount_paise)}
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 p-4 dark:border-ink-800 sm:border-l sm:border-t-0">
                    <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                      Cancellation fee
                    </div>
                    <div className="mt-1 text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                      {formatPrice(preview.penalty_amount_paise)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3 dark:border-ink-800">
                  <div className="text-[13px] text-zinc-500">Applicable policy</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {preview.tier_matched ?? 'No matching tier'}
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0L3.16 16.25A2 2 0 005 19z"
                    />
                  </svg>
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    This action cannot be undone. Your booking will be cancelled immediately.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-5 dark:border-ink-800">
            <button
              onClick={onClose}
              disabled={cancelMutation.isPending}
              className="press rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:text-zinc-300 dark:hover:bg-ink-800"
            >
              Keep booking
            </button>

            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Confirm cancellation'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
