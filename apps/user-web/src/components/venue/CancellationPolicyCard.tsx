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
  if (hours >= 168 && hours % 168 === 0)
    return `${hours / 168} week${hours / 168 > 1 ? 's' : ''} before`
  if (hours >= 24 && hours % 24 === 0) return `${hours / 24} day${hours / 24 > 1 ? 's' : ''} before`
  return `${hours} hour${hours !== 1 ? 's' : ''} before`
}

function refundTone(pct: string) {
  const num = parseFloat(pct)
  if (num >= 100) return { dot: 'bg-emerald-500', value: 'text-emerald-700 dark:text-emerald-400' }
  if (num >= 50) return { dot: 'bg-amber-500', value: 'text-amber-700 dark:text-amber-400' }
  return { dot: 'bg-red-500', value: 'text-red-600 dark:text-red-400' }
}

function PolicyRow({ label, pct }: { label: string; pct: string }) {
  const tone = refundTone(pct)
  const num = parseFloat(pct)
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${tone.value}`}>{num}% refund</span>
    </div>
  )
}

export function CancellationPolicyCard({ policy }: Props) {
  // No policy attached to venue
  if (!policy) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Cancellation policy
          </h2>
        </div>
        <p className="mt-4 text-sm italic text-zinc-400">
          No cancellation policy set by this venue.
        </p>
      </div>
    )
  }

  const tiers = buildTiers(policy)

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Cancellation policy
        </h2>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-ink-800">
        {tiers.map((tier) => (
          <PolicyRow key={tier.hours} label={tier.label} pct={tier.refundPct} />
        ))}
        <PolicyRow
          label={tiers.length > 0 ? 'Less notice / no-show' : 'Any cancellation'}
          pct={policy.no_show_refund_pct}
        />
      </div>

      {/* Platform fee note */}
      <p className="mt-4 flex items-start gap-1.5 text-xs text-zinc-400">
        <svg
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Platform fee is{' '}
        {policy.platform_fee_refundable
          ? 'refunded on cancellation.'
          : 'non-refundable and deducted from any refund amount.'}
      </p>

      {policy.notes && <p className="mt-2 text-xs leading-relaxed text-zinc-500">{policy.notes}</p>}
    </div>
  )
}
