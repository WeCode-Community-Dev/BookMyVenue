import type { BookingOut } from '../../types'
import { formatDateTz, formatTimeTz } from '../../utils'

type Props = {
  booking: BookingOut
  venueTimezone: string
}

type Activity = {
  title: string
  description: string
  date?: string | null
  completed: boolean
}

export function BookingActivity({ booking, venueTimezone }: Props) {
  const now = new Date()
  const eventStarted = now >= new Date(booking.starts_at)

  const activities: Activity[] = [
    {
      title: 'Booking Requested',
      description: 'Your booking request was submitted.',
      date: booking.created_at,
      completed: true,
    },
    {
      title: 'Payment Received',
      description:
        booking.payment_status === 'fully_paid'
          ? 'Full payment has been received.'
          : 'Advance payment has been received.',
      date: booking.amount_paid_paise > 0 ? (booking.confirmed_at ?? booking.created_at) : null,
      completed: booking.amount_paid_paise > 0,
    },
    {
      title: 'Booking Confirmed',
      description: 'Your reservation has been confirmed.',
      date: booking.confirmed_at,
      completed: booking.status === 'confirmed' || booking.status === 'completed',
    },
    {
      title: 'Event Day',
      description: eventStarted ? 'Your event is in progress.' : 'Upcoming',
      date: booking.starts_at,
      completed: eventStarted,
    },
    {
      title: 'Completed',
      description:
        booking.status === 'completed'
          ? 'Thank you for booking with us.'
          : 'Will appear after your event.',
      completed: booking.status === 'completed',
    },
  ]

  const cancelled = booking.cancelled_at

  return (
    <section className="py-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Booking Activity
      </h2>

      {cancelled && (
        <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3.5 dark:border-red-900/30 dark:bg-red-950/20">
          <p className="text-sm text-red-700 dark:text-red-400">
            This booking was cancelled on {formatDateTz(cancelled, venueTimezone)}.
          </p>
        </div>
      )}

      <div className="border-t border-zinc-200 dark:border-ink-800">
        {activities.map((activity, index) => (
          <div
            key={activity.title}
            className={`flex gap-4 py-4 ${
              index < activities.length - 1 ? 'border-b border-zinc-200 dark:border-ink-800' : ''
            }`}
          >
            <div className="flex w-6 flex-shrink-0 justify-center">
              <StatusDot completed={activity.completed} />
            </div>

            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className={`text-base font-medium ${
                  !activity.completed ? 'opacity-60' : ''
                } text-zinc-900 dark:text-zinc-100`}>
                  {activity.title}
                </h3>
                {activity.date && (
                  <span className={`text-sm ${
                    !activity.completed ? 'opacity-60' : ''
                  } text-zinc-500 dark:text-zinc-400`}>
                    {formatDateTz(activity.date, venueTimezone)}
                    {activity.title === 'Event Day' && (
                      <> {'·'} {formatTimeTz(activity.date, venueTimezone)}</>
                    )}
                  </span>
                )}
              </div>
              <p className={`mt-1 text-sm ${
                !activity.completed ? 'opacity-60' : ''
              } text-zinc-600 dark:text-zinc-400`}>
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatusDot({ completed }: { completed: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full ${
        completed
          ? 'bg-emerald-500 text-white'
          : 'border border-zinc-300 text-zinc-400 dark:border-ink-600'
      }`}
    >
      {completed ? (
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
      )}
    </span>
  )
}