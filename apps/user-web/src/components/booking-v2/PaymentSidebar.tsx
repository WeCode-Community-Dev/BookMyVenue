import type { BookingOut } from '../../types'
import { formatPrice } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CancellationPreviewModal } from '../booking/CancellationPreviewModal'

type Props = {
  booking: BookingOut
  className?: string
}

const CANCELLED_STATUSES = [
  'user_cancelled',
  'admin_cancelled',
  'conflict_cancelled',
  'balance_overdue_cancelled',
]

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

function formatStatus(value: string) {
  return value
    .split('_')
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' ')
}

export function BookingSummary({ booking, className = '' }: Props) {
  const navigate = useNavigate()
  const [cancelOpen, setCancelOpen] = useState(false)

  const isCancelled = CANCELLED_STATUSES.includes(booking.status)

  const isFullyPaid = booking.payment_status === 'fully_paid'
  const isAdvancePaid = booking.payment_status === 'advance_paid'
  const isUnpaid = booking.payment_status === 'unpaid'

  const totalAmount = booking.quoted_price_paise
  const amountPaid = booking.amount_paid_paise

  const remainingAmount = isFullyPaid
    ? 0
    : Math.max(0, totalAmount - amountPaid)

  const hasRemainingBalance = remainingAmount > 0
  const hasRefund = booking.refund_amount_paise > 0

  const showInvoice =
    booking.status === 'confirmed' ||
    booking.status === 'completed'

  const isFullPaymentRequired =
    booking.advance_pct === 100 ||
    booking.balance_due_paise === 0

  const showInstantPayment =
    booking.status === 'payment_pending' &&
    booking.payment_required

  const showAdvancePayment =
    booking.status === 'owner_accepted' &&
    isUnpaid

  const showBalancePayment =
    booking.status === 'confirmed' &&
    isAdvancePaid &&
    hasRemainingBalance

  const canCancel =
    !isCancelled &&
    ['requested', 'owner_accepted', 'payment_pending', 'confirmed'].includes(booking.status)

  const countdown = useCountdown(showInstantPayment ? booking.payment_expires_at : null)

  const paymentStatusText = isFullyPaid ? 'Fully Paid' : 
    isAdvancePaid ? 'Advance Paid' : 
    isUnpaid ? 'Payment Due' : 
    formatStatus(booking.payment_status)

  return (
    <>
      <div className={`rounded-xl border border-zinc-200 bg-white dark:border-ink-800 dark:bg-ink-900 shadow-sm ${className}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-ink-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Booking Summary
          </h2>
        </div>

        {/* Payment rows - Stripe style */}
        <dl className="divide-y divide-zinc-200 dark:divide-ink-800">
          <SummaryRow label="Total" value={formatPrice(totalAmount)} emphasized />
          
          <SummaryRow 
            label="Payment Status" 
            value={paymentStatusText} 
            status="success" 
          />

          <SummaryRow label="Paid" value={formatPrice(amountPaid)} />

          {hasRemainingBalance && (
            <SummaryRow 
              label="Remaining" 
              value={formatPrice(remainingAmount)} 
              status="warning" 
            />
          )}

          {hasRefund && (
            <SummaryRow 
              label="Refunded" 
              value={formatPrice(booking.refund_amount_paise)} 
              status="success" 
            />
          )}
        </dl>

        {/* Actions */}
        {!isCancelled && (
          <div className="border-t border-zinc-200 px-6 py-4 dark:border-ink-800">
            {showInstantPayment && !countdown?.expired && (
              <>
                {countdown && (
                  <div className="mb-4 text-center">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
                      Time remaining
                    </div>
                    <div className="mt-1 text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
                      {countdown.label}
                    </div>
                  </div>
                )}

                {booking.payment_options && !isFullPaymentRequired ? (
                  <>
                    <PrimaryButton onClick={() => navigate(`/payment/${booking.id}?type=advance`)}>
                      {`Pay Advance • ${booking.payment_options.advance.display_amount}`}
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={() => navigate(`/payment/${booking.id}?type=full`)}
                      className="mt-2"
                    >
                      {`Pay Full • ${booking.payment_options.full.display_amount}`}
                    </SecondaryButton>
                  </>
                ) : (
                  <PrimaryButton onClick={() => navigate(`/payment/${booking.id}?type=full`)}>
                    {`Complete Payment • ${booking.display?.quoted_price || ''}`}
                  </PrimaryButton>
                )}
              </>
            )}

            {showInstantPayment && countdown?.expired && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                This reservation hold has expired. Please book again.
              </div>
            )}

            {showAdvancePayment && booking.payment_options && !isFullPaymentRequired && (
              <>
                <PrimaryButton onClick={() => navigate(`/payment/${booking.id}?type=advance`)}>
                  {`Pay Advance • ${booking.payment_options.advance.display_amount}`}
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => navigate(`/payment/${booking.id}?type=full`)}
                  className="mt-2"
                >
                  {`Pay Full • ${booking.payment_options.full.display_amount}`}
                </SecondaryButton>
              </>
            )}

            {showAdvancePayment && (!booking.payment_options || isFullPaymentRequired) && (
              <PrimaryButton onClick={() => navigate(`/payment/${booking.id}?type=full`)}>
                {`Pay Full Amount • ${booking.display?.quoted_price || ''}`}
              </PrimaryButton>
            )}

            {showBalancePayment && (
              <PrimaryButton onClick={() => navigate(`/payment/${booking.id}?type=balance`)}>
                {`Pay Remaining • ${booking.display?.balance_due || ''}`}
              </PrimaryButton>
            )}
          </div>
        )}

        {/* Cancelled notice */}
        {isCancelled && (
          <div className="border-t border-zinc-200 px-6 py-4 dark:border-ink-800">
            <div className="text-sm text-red-600 dark:text-red-400">
              This booking has been cancelled.
            </div>
          </div>
        )}

        {/* Invoice */}
        {showInvoice && (
          <div className="border-t border-zinc-200 px-6 py-4 dark:border-ink-800">
            {booking.invoice_url ? (
              <a
                href={booking.invoice_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Download invoice
              </a>
            ) : (
              <span className="text-sm text-zinc-400">Invoice is being generated…</span>
            )}
          </div>
        )}

        {/* Support */}
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-ink-800">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Need help?{' '}
            <a href="#" className="text-zinc-900 underline hover:text-brand dark:text-zinc-100">
              Contact support
            </a>
          </div>
        </div>

        {/* Cancel */}
        {canCancel && !isCancelled && (
          <div className="px-6 pb-6">
            <DestructiveButton className="" onClick={() => setCancelOpen(true)}>
              Cancel Booking
            </DestructiveButton>
          </div>
        )}
      </div>

      <CancellationPreviewModal
        booking={booking}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
      />
    </>
  )
}

// Keep PaymentSidebar as alias for backwards compatibility
export const PaymentSidebar = BookingSummary

type SummaryRowProps = {
  label: string
  value: string
  emphasized?: boolean
  status?: 'success' | 'warning'
}

function SummaryRow({ label, value, emphasized = false, status }: SummaryRowProps) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-baseline gap-4 px-6 py-3">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd
        className={`font-medium ${
          emphasized
            ? 'text-base text-zinc-900 dark:text-zinc-100'
            : status === 'success'
              ? 'text-sm text-emerald-600 dark:text-emerald-400'
              : status === 'warning'
                ? 'text-sm text-amber-600 dark:text-amber-400'
                : 'text-sm text-zinc-900 dark:text-zinc-100'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

function PrimaryButton({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover ${className}`}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800 ${className}`}
    >
      {children}
    </button>
  )
}

function DestructiveButton({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 ${className}`}
    >
      {children}
    </button>
  )
}