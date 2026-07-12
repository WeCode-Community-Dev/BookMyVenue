import { useState } from 'react'
import { FileText } from 'lucide-react'

import type { BookingOut } from '../../types'

import { formatPrice } from '../../utils'

type Props = {
  booking: BookingOut
}

// Helper to determine payment summary visibility based on status
function usePaymentSummaryVisibility(booking: BookingOut) {
  const isUnpaid = booking.payment_status === 'unpaid'
  const isAdvancePaid = booking.payment_status === 'advance_paid'
  const isFullyPaid = booking.payment_status === 'fully_paid'

  // Calculate remaining based on payment status:
  // - If fully paid, remaining is 0
  // - Otherwise, use balance_due_paise
  const remaining = isFullyPaid ? 0 : booking.balance_due_paise

  // Check if booking is in a confirmed/completed state (for invoice)
  const showInvoice = booking.status === 'confirmed' || booking.status === 'completed'

  return {
    isUnpaid,
    isAdvancePaid,
    isFullyPaid,
    remaining,
    showInvoice,
    hasRemainingBalance: remaining > 0,
    hasRefund: booking.refund_amount_paise > 0,
    hasPayment: booking.amount_paid_paise > 0,
  }
}

export function PaymentSummaryCard({ booking }: Props) {
  const [showDetails, setShowDetails] = useState(false)
  const {
    isUnpaid,
    isAdvancePaid,
    isFullyPaid,
    hasRemainingBalance,
    hasRefund,
    hasPayment,
    showInvoice,
  } = usePaymentSummaryVisibility(booking)

  const totalPaid = booking.amount_paid_paise
  const refundAmount = booking.refund_amount_paise

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-6">
      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </span>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Payment</h3>
        </div>

        {/* Primary numbers: Total */}
        <div>
          <div className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">Total</div>
          <div className="mt-0.5 text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {formatPrice(booking.quoted_price_paise)}
          </div>
        </div>

        {/* Paid - always show since it indicates progress */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-ink-800">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Paid</span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {formatPrice(totalPaid)}
          </span>
        </div>

        {/* Remaining - only show when there's an outstanding balance */}
        {hasRemainingBalance && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Remaining</span>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {formatPrice(booking.balance_due_paise)}
            </span>
          </div>
        )}

        {/* Details toggle - only show when there's something meaningful to expand */}
        {(hasPayment || hasRefund || isUnpaid) && (
          <div className="border-t border-zinc-100 pt-4 dark:border-ink-800">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="press flex w-full items-center justify-between text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <span>{showDetails ? 'Hide details' : 'Show details'}</span>
              <svg
                className={'h-4 w-4 transition-transform ' + (showDetails ? 'rotate-180' : '')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDetails && (
              <div className="mt-4 space-y-3">
                <SummaryRow label="Venue fee" value={formatPrice(booking.quoted_price_paise)} />
                <SummaryRow label="Platform fee" value={formatPrice(booking.platform_fee_paise)} />

                {/* Advance due - show what's due for unpaid bookings, or show advance paid for paid bookings */}
                {isUnpaid ? (
                  <SummaryRow label="Advance due" value={formatPrice(booking.advance_due_paise)} />
                ) : isAdvancePaid ? (
                  <SummaryRow label="Advance paid" value={formatPrice(totalPaid)} emphasized />
                ) : null}

                {/* Amount paid - show when user has made a payment (not unpaid) and not already shown as advance paid */}
                {!isUnpaid && !isAdvancePaid && hasPayment && (
                  <SummaryRow label="Amount paid" value={formatPrice(totalPaid)} emphasized />
                )}

                {/* Refund - only show when there's a refund */}
                {hasRefund && (
                  <SummaryRow label="Refunded" value={formatPrice(refundAmount)} />
                )}
              </div>
            )}
          </div>
        )}

        {/* Invoice - only show for confirmed/completed bookings */}
        {showInvoice && (
          <div className="border-t border-zinc-100 pt-5 dark:border-ink-800">
            {booking.invoice_url ? (
              <a
                href={booking.invoice_url}
                target="_blank"
                rel="noreferrer"
                className="press flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:text-zinc-200 dark:hover:bg-ink-800"
              >
                <FileText className="h-4 w-4" />
                Download invoice
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-400 dark:bg-ink-800">
                <FileText className="h-4 w-4" />
                Invoice is being generated…
              </div>
            )}
          </div>
        )}

        {/* Balance Due — only when there is an outstanding balance (not fully paid) */}
        {!isFullyPaid && hasRemainingBalance && booking.balance_due_date && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="text-sm font-medium text-amber-900 dark:text-amber-300">
              Balance due
            </div>
            <div className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
              Payment must be completed before the due date to avoid cancellation.
            </div>
            <div className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-300">
              {booking.balance_due_date}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type SummaryRowProps = {
  label: string
  value: string
  emphasized?: boolean
}

function SummaryRow({ label, value, emphasized = false }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
      <span
        className={
          emphasized
            ? 'text-base font-semibold text-zinc-900 dark:text-zinc-100'
            : 'text-sm font-medium text-zinc-700 dark:text-zinc-300'
        }
      >
        {value}
      </span>
    </div>
  )
}