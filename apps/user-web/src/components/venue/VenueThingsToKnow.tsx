import type { ReactNode } from 'react'
import type { VenueResponse } from '../../types'

type Props = { venue: VenueResponse }

function formatTimeStr(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function RuleItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
      <svg className="h-4 w-4 shrink-0 mt-0.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      {text}
    </li>
  )
}

function Column({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-zinc-500">{icon}</span>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <RuleItem key={i} text={item} />
        ))}
      </ul>
    </div>
  )
}

export function VenueThingsToKnow({ venue }: Props) {
  const bookingRules: string[] = [
    `Open ${formatTimeStr(venue.open_time)} – ${formatTimeStr(venue.close_time)}`,
    `${Number(venue.advance_pct)}% advance payment within 24h of acceptance`,
    `Balance due ${venue.balance_due_days_before_event} day${venue.balance_due_days_before_event !== 1 ? 's' : ''} before the event`,
    `Owner must accept or reject within ${venue.owner_action_window_hours}h`,
    ...(venue.min_booking_duration_minutes > 0
      ? [`Minimum booking: ${venue.min_booking_duration_minutes / 60}h`]
      : []),
  ]

  const setupRules: string[] = [
    ...(venue.pre_buffer_minutes > 0
      ? [`${venue.pre_buffer_minutes} min setup time before your slot`]
      : []),
    ...(venue.post_buffer_minutes > 0
      ? [`${venue.post_buffer_minutes} min cleanup time after your slot`]
      : []),
    'Any damages may be charged to the guest',
    'Follow venue-specific rules provided by the host',
    'No modifications after booking is confirmed',
  ]

  const cancellationRules: string[] = []
  const policy = venue.cancellation_policy
  if (policy) {
    if (policy.tier_1_hours != null && policy.tier_1_refund_pct != null) {
      cancellationRules.push(
        `Cancel ${policy.tier_1_hours}h+ before → ${parseFloat(policy.tier_1_refund_pct)}% refund`
      )
    }
    if (policy.tier_2_hours != null && policy.tier_2_refund_pct != null) {
      cancellationRules.push(
        `Cancel ${policy.tier_2_hours}h+ before → ${parseFloat(policy.tier_2_refund_pct)}% refund`
      )
    }
    if (policy.tier_3_hours != null && policy.tier_3_refund_pct != null) {
      cancellationRules.push(
        `Cancel ${policy.tier_3_hours}h+ before → ${parseFloat(policy.tier_3_refund_pct)}% refund`
      )
    }
    cancellationRules.push(
      `No-show / last minute → ${parseFloat(policy.no_show_refund_pct)}% refund`
    )
    cancellationRules.push(
      policy.platform_fee_refundable
        ? 'Platform fee is refunded on cancellation'
        : 'Platform fee is non-refundable'
    )
  } else {
    cancellationRules.push('No cancellation policy set — contact the host')
    cancellationRules.push('Refunds at the discretion of the venue owner')
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Things to know</h2>

      <div className="grid gap-8 sm:grid-cols-3">
        <Column
          title="Booking rules"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          items={bookingRules}
        />

        <Column
          title="Venue & safety"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          items={setupRules}
        />

        <Column
          title="Cancellation policy"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          }
          items={cancellationRules}
        />
      </div>
    </div>
  )
}
