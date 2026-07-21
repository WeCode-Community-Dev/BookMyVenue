import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import type { BookingOut } from '../../types'

import { CancellationPreviewModal } from './CancellationPreviewModal'
import { Alert } from '@venue404/ui'

type Props = {
  booking: BookingOut
}

const CANCELLED_STATUSES = [
  'user_cancelled',
  'admin_cancelled',
  'conflict_cancelled',
  'balance_overdue_cancelled',
]

// NEW — simple mm:ss countdown against an ISO deadline
function useCountdown(deadlineIso: string | null | undefined) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null)

  useEffect(() => {
    if (!deadlineIso) {
      setRemainingMs(null)
      return
    }

    const deadline = new Date(deadlineIso).getTime()

    const tick = () => setRemainingMs(Math.max(0, deadline - Date.now()))
    tick()

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [deadlineIso])

  if (remainingMs === null) return null

  const totalSeconds = Math.floor(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return {
    label: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    expired: remainingMs <= 0,
  }
}

function PrimaryActionButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="press w-full rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white shadow-sm outline-none transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink-900"
    >
      {children}
    </button>
  )
}

function SecondaryActionButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="press w-full rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
    >
      {children}
    </button>
  )
}

function DestructiveActionButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="press w-full rounded-lg border border-red-200 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
    >
      {children}
    </button>
  )
}

export function BookingActionsCard({ booking }: Props) {
  const navigate = useNavigate()
  const [cancelOpen, setCancelOpen] = useState(false)

  const isFullPaymentRequired = booking.advance_pct === 100 || booking.balance_due_paise === 0

  const showAdvancePayment = booking.status === 'owner_accepted'
  const showBalancePayment =
    booking.status === 'confirmed' &&
    booking.payment_status === 'advance_paid' &&
    booking.balance_due_paise > 0

  // NEW — Instant Booking: reserved slot, payment_pending, hold ticking down
  const showInstantPayment = booking.status === 'payment_pending' && booking.payment_required
  const countdown = useCountdown(showInstantPayment ? booking.payment_expires_at : null)

  const isCancelled = CANCELLED_STATUSES.includes(booking.status)

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </span>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Actions</h3>
          </div>

          {isCancelled && <Alert variant="destructive">This booking has been cancelled.</Alert>}

          {/* Instant Booking — payment countdown + Advance/Full choice */}
          {showInstantPayment && !countdown?.expired && (
            <>
              {countdown && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    Time remaining
                  </div>
                  <div className="mt-1 text-2xl font-bold tabular-nums text-amber-900 dark:text-amber-300">
                    {countdown.label}
                  </div>
                </div>
              )}

              {booking.payment_options && !isFullPaymentRequired ? (
                <>
                  <PrimaryActionButton
                    onClick={() => navigate(`/payment/${booking.id}?type=advance`)}
                  >
                    {`Pay Advance • ${booking.payment_options.advance.display_amount}`}
                  </PrimaryActionButton>
                  <SecondaryActionButton
                    onClick={() => navigate(`/payment/${booking.id}?type=full`)}
                  >
                    {`Pay Full Amount • ${booking.payment_options.full.display_amount}`}
                  </SecondaryActionButton>
                </>
              ) : (
                <PrimaryActionButton onClick={() => navigate(`/payment/${booking.id}?type=full`)}>
                  {`Complete Payment • ${booking.display?.quoted_price || ''}`}
                </PrimaryActionButton>
              )}
            </>
          )}

          {showInstantPayment && countdown?.expired && (
            <Alert variant="warning">This reservation hold has expired. Please book again.</Alert>
          )}

          {/* Advance Payment Button (Manual flow) */}
          {showAdvancePayment && booking.payment_options && !isFullPaymentRequired ? (
            <>
              <PrimaryActionButton onClick={() => navigate(`/payment/${booking.id}?type=advance`)}>
                {`Pay Advance • ${booking.payment_options.advance.display_amount}`}
              </PrimaryActionButton>
              <SecondaryActionButton onClick={() => navigate(`/payment/${booking.id}?type=full`)}>
                {`Pay Full Amount • ${booking.payment_options.full.display_amount}`}
              </SecondaryActionButton>
            </>
          ) : showAdvancePayment ? (
            <PrimaryActionButton onClick={() => navigate(`/payment/${booking.id}?type=full`)}>
              {`Pay Full Amount • ${booking.display?.quoted_price || ''}`}
            </PrimaryActionButton>
          ) : null}

          {/* Balance Payment Button */}
          {showBalancePayment && (
            <PrimaryActionButton onClick={() => navigate(`/payment/${booking.id}?type=balance`)}>
              {`Pay Remaining Balance • ${booking.display?.balance_due || ''}`}
            </PrimaryActionButton>
          )}

          {/* Cancel Buttons */}
          {(showAdvancePayment ||
            showBalancePayment ||
            (showInstantPayment && !countdown?.expired)) && (
            <DestructiveActionButton onClick={() => setCancelOpen(true)}>
              Cancel Booking
            </DestructiveActionButton>
          )}

          {booking.status === 'requested' && (
            <DestructiveActionButton onClick={() => setCancelOpen(true)}>
              Cancel Request
            </DestructiveActionButton>
          )}

          {booking.status === 'confirmed' && !showBalancePayment && (
            <DestructiveActionButton onClick={() => setCancelOpen(true)}>
              Cancel Booking
            </DestructiveActionButton>
          )}

          {booking.status === 'owner_rejected' && (
            <Alert variant="warning">This booking request was declined by the venue owner.</Alert>
          )}

          {(booking.status === 'hold_expired' || booking.status === 'request_expired') && (
            <Alert variant="warning">This booking has expired.</Alert>
          )}
        </div>
      </div>

      <CancellationPreviewModal
        booking={booking}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
      />
    </>
  )
}
