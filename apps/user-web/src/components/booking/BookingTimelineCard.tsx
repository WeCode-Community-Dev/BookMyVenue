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
          border: 'border-emerald-100 dark:border-emerald-900/50',
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          title: 'text-emerald-800 dark:text-emerald-300',
          body: 'text-emerald-700 dark:text-emerald-400',
        }
      : {
          border: 'border-red-100 dark:border-red-900/50',
          bg: 'bg-red-50 dark:bg-red-950/30',
          title: 'text-red-800 dark:text-red-300',
          body: 'text-red-700 dark:text-red-400',
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
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-ink-800 dark:bg-ink-900 sm:p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Timeline</h3>
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
                      'flex h-5 w-5 items-center justify-center rounded-full transition-all',
                      isCompleted ? 'bg-brand text-white' : 'bg-zinc-200 dark:bg-ink-700',
                      isCurrent ? 'ring-4 ring-brand-light dark:ring-brand/20' : '',
                    ].join(' ')}
                  >
                    {isCompleted && (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {!isLast && (
                    <div
                      className={[
                        'min-h-[36px] w-px flex-1',
                        isCompleted ? 'bg-brand-muted' : 'bg-zinc-200 dark:bg-ink-700',
                      ].join(' ')}
                    />
                  )}
                </div>

                <div className="pb-6">
                  <div
                    className={[
                      'text-sm font-medium',
                      isCompleted ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500',
                    ].join(' ')}
                  >
                    {step.label}
                  </div>

                  <div className="mt-0.5 text-[13px] text-zinc-500">
                    {getStepDescription(step.label)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

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
