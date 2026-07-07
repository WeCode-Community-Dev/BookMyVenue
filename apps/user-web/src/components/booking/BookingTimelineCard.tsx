import type { BookingOut } from '../../types'

type Props = {
  booking: BookingOut
}

type TimelineStep = {
  label: string
  completed: boolean
}

function getStepDescription(label: string): string {
  switch (label) {
    case 'Requested':
      return 'Booking request submitted.'
    case 'Accepted':
      return 'Venue owner accepted the request.'
    case 'Advance Paid':
      return 'Payment received.'
    case 'Confirmed':
      return 'Booking reservation confirmed.'
    case 'Event Day':
      return 'Event date has arrived.'
    case 'Completed':
      return 'Booking lifecycle completed.'
    default:
      return ''
  }
}

function TimelineNotice({
  tone,
  title,
  description,
}: {
  tone: 'success' | 'danger'
  title: string
  description: string
}) {
  const palette =
    tone === 'success'
      ? {
          border: 'border-emerald-100',
          bg: 'bg-emerald-50',
          title: 'text-emerald-800',
          body: 'text-emerald-700',
        }
      : {
          border: 'border-red-100',
          bg: 'bg-red-50',
          title: 'text-red-800',
          body: 'text-red-700',
        }

  return (
    <div className={`rounded-xl border ${palette.border} ${palette.bg} px-4 py-3`}>
      <div className={`text-sm font-medium ${palette.title}`}>{title}</div>
      <div className={`mt-1 text-xs ${palette.body}`}>{description}</div>
    </div>
  )
}

const CANCELLED_STATUSES = [
  'user_cancelled',
  'admin_cancelled',
  'owner_rejected',
  'conflict_cancelled',
  'hold_expired',
  'request_expired',
  'balance_overdue_cancelled',
]

export function BookingTimelineCard({ booking }: Props) {
  const now = new Date()

  const isCancelled = booking.cancelled_at !== null || CANCELLED_STATUSES.includes(booking.status)

  const eventStarted = !isCancelled && now >= new Date(booking.starts_at)

  // Supports both advance and full payment
  const paymentCompleted =
    booking.balance_due_paise === 0
      ? booking.amount_paid_paise >= booking.quoted_price_paise
      : booking.amount_paid_paise >= booking.advance_due_paise

  const acceptedStatuses = ['owner_accepted', 'payment_pending', 'confirmed', 'completed']

  const confirmedStatuses = ['confirmed', 'completed']

  const steps: TimelineStep[] = [
    {
      label: 'Requested',
      completed: true,
    },
    {
      label: 'Accepted',
      completed: acceptedStatuses.includes(booking.status),
    },
    {
      label: 'Advance Paid',
      completed: paymentCompleted,
    },
    {
      label: 'Confirmed',
      completed: confirmedStatuses.includes(booking.status),
    },
    {
      label: 'Event Day',
      completed: eventStarted,
    },
    {
      label: 'Completed',
      completed: booking.status === 'completed',
    },
  ]

  let currentStepIndex = steps.findIndex((s) => !s.completed)

  if (currentStepIndex === -1) {
    currentStepIndex = steps.length - 1
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      <div className="space-y-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Booking Timeline
        </div>

        <div>
          {steps.map((step, index) => {
            const isCompleted = step.completed
            const isCurrent = index === currentStepIndex
            const isLast = index === steps.length - 1

            return (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      'h-4 w-4 rounded-full transition-all',
                      isCompleted ? 'bg-brand' : 'bg-zinc-200',
                      isCurrent ? 'ring-4 ring-brand-light' : '',
                    ].join(' ')}
                  />

                  {!isLast && (
                    <div
                      className={[
                        'min-h-[48px] w-px flex-1',
                        isCompleted ? 'bg-brand-muted' : 'bg-zinc-200',
                      ].join(' ')}
                    />
                  )}
                </div>

                <div className="pb-8">
                  <div
                    className={[
                      'font-medium',
                      isCompleted ? 'text-zinc-900' : 'text-zinc-500',
                    ].join(' ')}
                  >
                    {step.label}
                  </div>

                  <div className="mt-1 text-sm text-zinc-500">{getStepDescription(step.label)}</div>
                </div>
              </div>
            )
          })}
        </div>

        {booking.confirmed_at && !isCancelled && (
          <TimelineNotice
            tone="success"
            title="Booking confirmed"
            description="Your booking has been confirmed and reserved."
          />
        )}

        {isCancelled && (
          <TimelineNotice
            tone="danger"
            title="Booking cancelled"
            description="This booking is no longer active."
          />
        )}
      </div>
    </div>
  )
}
