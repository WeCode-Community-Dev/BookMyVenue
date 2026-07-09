import { formatPrice } from '../../utils'
import type { PricingQuote, BookingDisplay } from '../../types'

type FromQuote = {
  source: 'quote'
  quote: PricingQuote
  loading?: boolean
}

type FromBooking = {
  source: 'booking'
  display: BookingDisplay
  balanceDueDate?: string | null
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
      className={`flex items-center justify-between py-2.5 ${!muted ? 'border-b border-zinc-100 dark:border-ink-800' : ''}`}
    >
      <span className={`text-sm ${muted ? 'text-zinc-400' : 'text-zinc-500'}`}>{label}</span>
      {loading ? (
        <span className="h-4 w-20 rounded bg-zinc-100 dark:bg-ink-800 animate-pulse" />
      ) : (
        <span
          className={`text-sm ${
            bold
              ? 'text-base font-semibold text-zinc-900 dark:text-zinc-100'
              : muted
                ? 'text-zinc-400'
                : 'font-medium text-zinc-700 dark:text-zinc-300'
          }`}
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
    <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
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
  if (props.source === 'quote') {
    const { quote, loading = false } = props

    const quoted = loading ? '—' : formatPrice(quote?.quoted_price_paise ?? null)
    const advance = loading ? '—' : formatPrice(quote?.advance_due_paise ?? null)
    const balance = loading ? '—' : formatPrice(quote?.balance_due_paise ?? null)
    const fee = loading ? '—' : formatPrice(quote?.platform_fee_paise ?? null)
    const payout = loading ? '—' : formatPrice(quote?.owner_payout_paise ?? null)

    return (
      <div className="rounded-2xl border border-zinc-100 bg-white px-4 py-1 shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <Row label="Total price" value={quoted} bold loading={loading} />
        <Row label="Advance due now" value={advance} loading={loading} />
        <Row label="Balance due later" value={balance} loading={loading} />
        <div className="mt-1 border-t border-zinc-100 pt-1 dark:border-ink-800">
          <Row label="Platform fee" value={fee} muted loading={loading} />
          <Row label="Owner receives" value={payout} muted loading={loading} />
        </div>
      </div>
    )
  }

  // source === 'booking'
  const { display, balanceDueDate } = props

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white px-4 py-1 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <Row label="Total price" value={display.quoted_price} bold />
      <Row label="Advance paid" value={display.advance_due} />
      <Row label="Balance due" value={display.balance_due} />

      {balanceDueDate && (
        <div className="pb-2">
          <BalanceDueNotice date={balanceDueDate} />
        </div>
      )}

      <div className="mt-1 border-t border-zinc-100 pt-1 dark:border-ink-800">
        <Row label="Platform fee" value={display.platform_fee} muted />
        <Row label="Owner receives" value={display.owner_payout} muted />
      </div>
    </div>
  )
}
