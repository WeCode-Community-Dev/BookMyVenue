import { formatPrice } from '../../utils'
import type { PricingQuote, BookingOut } from '../../types'

type FromQuote = {
  source: 'quote'
  quote: PricingQuote
  loading?: boolean
  /** Set when nested inside another card (e.g. BookingSummaryCard) so this
   * component doesn't draw its own border/shadow/background on top of the
   * parent's. Defaults to false (standalone, boxed). */
  embedded?: boolean
}

type FromBooking = {
  source: 'booking'
  booking: BookingOut
  /** Set when nested inside another card (e.g. BookingSummaryCard) so this
   * component doesn't draw its own border/shadow/background on top of the
   * parent's. Defaults to false (standalone, boxed). */
  embedded?: boolean
}

type Props = FromQuote | FromBooking

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({
  label,
  value,
  bold,
  muted,
  loading,
}: {
  label: string
  value: string
  bold?: boolean
  muted?: boolean
  loading?: boolean
}) {
  return (
    <div
      className={'flex items-center justify-between py-2.5 ' + (!muted ? 'border-b border-zinc-100 dark:border-ink-800' : '')}
    >
      <span
        className={'text-sm ' + (muted ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400')}
      >
        {label}
      </span>
      {loading ? (
        <span className="h-4 w-20 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
      ) : (
        <span
          className={
            'text-sm ' +
            (bold
              ? 'text-base font-semibold text-zinc-900 dark:text-zinc-100'
              : muted
                ? 'text-zinc-400 dark:text-zinc-500'
                : 'font-medium text-zinc-700 dark:text-zinc-300')
          }
        >
          {value}
        </span>
      )}
    </div>
  )
}

// ─── Balance-due notice ──────────────────────────────────────────────────────

function BalanceDueNotice({ date }: { date: string }) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        Balance due by{' '}
        {new Date(date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function QuoteBreakdown(props: Props) {
  const embedded = props.embedded ?? false
  const wrapperClass = embedded
    ? ''
    : 'rounded-2xl border border-zinc-100 bg-white px-5 py-4 shadow-sm dark:border-ink-800 dark:bg-ink-900'

  if (props.source === 'quote') {
    const { quote, loading = false } = props

    const quoted = loading ? '—' : formatPrice(quote?.quoted_price_paise ?? null)
    const advance = loading ? '—' : formatPrice(quote?.advance_due_paise ?? null)
    const balance = loading ? '—' : formatPrice(quote?.balance_due_paise ?? null)
    const fee = loading ? '—' : formatPrice(quote?.platform_fee_paise ?? null)
    const payout = loading ? '—' : formatPrice(quote?.owner_payout_paise ?? null)

    return (
      <div className={wrapperClass}>
        <Row label="Total price" value={quoted} bold loading={loading} />
        <Row label="Advance due now" value={advance} loading={loading} />
        <Row label="Balance due later" value={balance} loading={loading} />
        <div className="mt-1.5 border-t border-zinc-100 pt-1.5 dark:border-ink-800">
          <Row label="Platform fee" value={fee} muted loading={loading} />
          <Row label="Owner receives" value={payout} muted loading={loading} />
        </div>
      </div>
    )
  }

  // source === 'booking'
  const { booking } = props

  // Defensive logic: when fully paid, the backend should have updated advance_due_paise
  // to quoted_price_paise and balance_due_paise to 0. If not, we compute remaining
  // based on payment_status to avoid showing stale balance values.
  const isFullyPaid = booking.payment_status === 'fully_paid'
  const advanceDuePaise = isFullyPaid ? booking.quoted_price_paise : booking.advance_due_paise
  const balanceDuePaise = isFullyPaid ? 0 : booking.balance_due_paise

  const advance = formatPrice(advanceDuePaise)
  const balance = formatPrice(balanceDuePaise)

  // Detect whether there is still a balance remaining (for BalanceDueNotice)
  const hasBalanceDue = balanceDuePaise > 0

  return (
    <div className={wrapperClass}>
      <Row label="Total price" value={formatPrice(booking.quoted_price_paise)} bold />

      <Row label="Advance due now" value={advance} />

      <Row label="Balance due later" value={balance} />

      {hasBalanceDue && booking.balance_due_date && (
        <div className="pb-1">
          <BalanceDueNotice date={booking.balance_due_date} />
        </div>
      )}

      <div className="mt-1.5 border-t border-zinc-100 pt-1.5 dark:border-ink-800">
        <Row label="Platform fee" value={formatPrice(booking.platform_fee_paise)} muted />
        <Row label="Owner receives" value={formatPrice(booking.owner_payout_paise)} muted />
      </div>
    </div>
  )
}