import { FileText } from 'lucide-react'

import type { BookingOut } from '../../types'

import { formatPrice } from '../../utils'

type Props = {
  booking: BookingOut
}

export function PaymentSummaryCard({ booking }: Props) {
  const totalPaid = booking.amount_paid_paise
  const refundAmount = booking.refund_amount_paise

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="space-y-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Payment Summary
        </div>

        {/* Primary Amount */}
        <div>
          <div className="text-sm text-zinc-500">Total Booking Amount</div>
          <div className="mt-1 text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {formatPrice(booking.quoted_price_paise)}
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3 border-t border-zinc-100 pt-5 dark:border-ink-800">
          <SummaryRow label="Venue Fee" value={formatPrice(booking.quoted_price_paise)} />
          <SummaryRow label="Platform Fee" value={formatPrice(booking.platform_fee_paise)} />
        </div>

        {/* Payment Status */}
        <div className="space-y-3 border-t border-zinc-100 pt-5 dark:border-ink-800">
          <SummaryRow label="Advance Due" value={formatPrice(booking.advance_due_paise)} />
          <SummaryRow
            label="Remaining Balance"
            value={formatPrice(booking.balance_due_paise)}
            emphasized
          />
        </div>

        {/* Paid */}
        <div className="space-y-3 border-t border-zinc-100 pt-5 dark:border-ink-800">
          <SummaryRow label="Amount Paid" value={formatPrice(totalPaid)} />
          {refundAmount > 0 && <SummaryRow label="Refunded" value={formatPrice(refundAmount)} />}
        </div>

        {/* Helpful Summary */}
        <div className="rounded-xl bg-zinc-50 px-4 py-4 dark:bg-ink-800">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Payment Status</div>
          <div className="mt-1 text-sm capitalize text-zinc-500">
            {booking.payment_status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Invoice */}
        {booking.status === 'confirmed' && (
          <div className="border-t border-zinc-100 pt-5 dark:border-ink-800">
            {booking.invoice_url ? (
              <a
                href={booking.invoice_url}
                target="_blank"
                rel="noreferrer"
                className="press flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-ink-700 dark:text-zinc-200 dark:hover:bg-ink-800"
              >
                <FileText className="h-4 w-4" />
                Download invoice
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-400 dark:bg-ink-800">
                <FileText className="h-4 w-4" />
                Invoice is being generated…
              </div>
            )}
          </div>
        )}

        {/* Balance Due Date */}
        {booking.balance_due_date && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="text-sm font-medium text-amber-900 dark:text-amber-300">Balance Due</div>
            <div className="mt-1 text-sm text-amber-700 dark:text-amber-400">
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
      <span className="text-sm text-zinc-500">{label}</span>
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
