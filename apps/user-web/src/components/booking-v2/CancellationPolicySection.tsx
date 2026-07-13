import type { CancellationPolicy } from '../../types'

type Props = {
  policy: CancellationPolicy | null | undefined
}

export function CancellationPolicySection({ policy }: Props) {
  if (!policy) {
    return (
      <section className="border-t border-zinc-200 py-8 dark:border-ink-800">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Cancellation Policy
        </h2>
        <p className="text-sm text-zinc-500">No cancellation policy set by this venue.</p>
      </section>
    )
  }

  const tiers = buildTiers(policy)

  return (
    <section className="border-t border-zinc-200 py-8 dark:border-ink-800">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Cancellation Policy
      </h2>

      <table className="w-full text-sm">
        <tbody>
          {tiers.map((tier) => (
            <tr key={tier.hours} className="border-b border-zinc-200 dark:border-ink-800 last:border-0">
              <td className="py-3 text-zinc-700 dark:text-zinc-300">{tier.label}</td>
              <td className="py-3 text-right">
                <span className={`font-medium ${refundTone(tier.refundPct)}`}>
                  {tier.refundPct}% refund
                </span>
              </td>
            </tr>
          ))}
          <tr className={tiers.length > 0 ? '' : 'border-b border-zinc-200 dark:border-ink-800'}>
            <td className="py-3 text-zinc-700 dark:text-zinc-300">
              {tiers.length > 0 ? 'Less notice / no-show' : 'Any cancellation'}
            </td>
            <td className="py-3 text-right">
              <span className={`font-medium ${refundTone(policy.no_show_refund_pct)}`}>
                {policy.no_show_refund_pct}% refund
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mt-4 text-xs text-zinc-500">
        Platform fee is{' '}
        {policy.platform_fee_refundable
          ? 'refunded on cancellation.'
          : 'non-refundable and deducted from any refund amount.'}
      </p>

      {policy.notes && <p className="mt-2 text-xs leading-relaxed text-zinc-500">{policy.notes}</p>}
    </section>
  )
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
  if (hours >= 168 && hours % 168 === 0)
    return `${hours / 168} week${hours / 168 > 1 ? 's' : ''} before`
  if (hours >= 24 && hours % 24 === 0) return `${hours / 24} day${hours / 24 > 1 ? 's' : ''} before`
  return `${hours} hour${hours !== 1 ? 's' : ''} before`
}

function refundTone(pct: string): string {
  const num = parseFloat(pct)
  if (num >= 100) return 'text-emerald-600 dark:text-emerald-400'
  if (num >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}