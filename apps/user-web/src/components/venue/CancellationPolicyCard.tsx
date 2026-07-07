import type { CancellationPolicy } from '../../types'

type Props = {
  policy: CancellationPolicy | null | undefined
}

type Tier = {
  label: string
  hours: number
  refundPct: string
}

function buildTiers(policy: CancellationPolicy): Tier[] {
  const tiers: Tier[] = []

  if (policy.tier_1_hours != null && policy.tier_1_refund_pct != null) {
    tiers.push({
      label: hoursLabel(policy.tier_1_hours),
      hours: policy.tier_1_hours,
      refundPct: policy.tier_1_refund_pct,
    })
  }
  if (policy.tier_2_hours != null && policy.tier_2_refund_pct != null) {
    tiers.push({
      label: hoursLabel(policy.tier_2_hours),
      hours: policy.tier_2_hours,
      refundPct: policy.tier_2_refund_pct,
    })
  }
  if (policy.tier_3_hours != null && policy.tier_3_refund_pct != null) {
    tiers.push({
      label: hoursLabel(policy.tier_3_hours),
      hours: policy.tier_3_hours,
      refundPct: policy.tier_3_refund_pct,
    })
  }

  return tiers
}

function hoursLabel(hours: number): string {
  if (hours >= 168 && hours % 168 === 0) return `${hours / 168} week${hours / 168 > 1 ? 's' : ''} before`
  if (hours >= 24 && hours % 24 === 0) return `${hours / 24} day${hours / 24 > 1 ? 's' : ''} before`
  return `${hours} hour${hours !== 1 ? 's' : ''} before`
}

function RefundPill({ pct }: { pct: string }) {
  const num = parseFloat(pct)
  const color =
    num >= 100 ? 'bg-green-50 text-green-700' :
    num >= 50  ? 'bg-amber-50 text-amber-700' :
                 'bg-red-50 text-red-600'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {num}% refund
    </span>
  )
}

export function CancellationPolicyCard({ policy }: Props) {
  // No policy attached to venue
  if (!policy) {
    return (
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 mb-3 dark:text-zinc-100">Cancellation Policy</h2>
        <p className="text-sm text-zinc-400 italic">No cancellation policy set by this venue.</p>
      </div>
    )
  }

  const tiers = buildTiers(policy)

  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-900 mb-3">Cancellation Policy</h2>

      <div className="rounded-xl border border-zinc-100 overflow-hidden dark:border-ink-800">
        {tiers.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 dark:bg-ink-900 dark:border-ink-800">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Cancel at least
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  You receive
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-ink-800">
              {tiers.map((tier) => (
                <tr key={tier.hours} className="bg-white hover:bg-zinc-50/50 transition-colors dark:bg-ink-950 dark:hover:bg-ink-900/50">
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{tier.label}</td>
                  <td className="px-4 py-3 text-right">
                    <RefundPill pct={tier.refundPct} />
                  </td>
                </tr>
              ))}
              {/* Fallback / last-minute row */}
              <tr className="bg-white hover:bg-zinc-50/50 transition-colors dark:bg-ink-950 dark:hover:bg-ink-900/50">
                <td className="px-4 py-3 text-zinc-500 italic">
                  {tiers.length > 0 ? 'Less notice / no-show' : 'Any cancellation'}
                </td>
                <td className="px-4 py-3 text-right">
                  <RefundPill pct={policy.no_show_refund_pct} />
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Any cancellation</span>
            <RefundPill pct={policy.no_show_refund_pct} />
          </div>
        )}
      </div>

      {/* Platform fee note */}
      <p className="mt-2.5 text-xs text-zinc-400 flex items-start gap-1.5">
        <svg className="h-3.5 w-3.5 shrink-0 mt-0.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Platform fee is{' '}
        {policy.platform_fee_refundable
          ? 'refunded on cancellation.'
          : 'non-refundable and deducted from any refund amount.'}
      </p>

      {policy.notes && (
        <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{policy.notes}</p>
      )}
    </div>
  )
}