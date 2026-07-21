import { useNavigate } from 'react-router-dom'

import { Button, Card } from '@venue404/ui'

import type { BookingOut } from '../../types'

import { formatDate, formatTime } from '../../utils'

import BookingStatusBadge from './BookingStatusBadge'

type Props = {
  booking: BookingOut
}

export default function MyBookingCard({ booking }: Props) {
  const navigate = useNavigate()

  const requiresInstantPayment = booking.status === 'payment_pending' && booking.payment_required
  const requiresAdvance = booking.status === 'owner_accepted'

  const requiresBalance =
    booking.status === 'confirmed' &&
    booking.payment_status === 'advance_paid' &&
    booking.balance_due_paise > 0

  const actionRequired = requiresInstantPayment || requiresAdvance || requiresBalance

  const actionLabel = requiresInstantPayment
    ? 'Complete Payment'
    : requiresAdvance
      ? 'Pay Advance'
      : requiresBalance
        ? 'Pay Balance'
        : 'View Booking'

  return (
    <Card className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-ink-800 dark:bg-ink-900">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative shrink-0 md:w-[260px]">
          {booking.venue_cover_photo_url ? (
            <img
              src={booking.venue_cover_photo_url}
              alt={booking.venue_name}
              loading="lazy"
              className="h-64 w-full object-cover md:h-full"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 md:h-full dark:from-ink-800 dark:to-ink-900">
              <svg
                className="h-9 w-9 text-zinc-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                />
              </svg>
            </div>
          )}

          {actionRequired && (
            <div className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow">
              Action required
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <BookingStatusBadge status={booking.status} />

              <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {booking.venue_name}
              </h3>

              <p className="mt-0.5 text-sm text-zinc-500">{booking.venue_city}</p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {booking.display.quoted_price}
              </div>
              <div className="text-xs text-zinc-400">Total value</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>{formatDate(booking.starts_at)}</Chip>
            <Chip>
              {formatTime(booking.starts_at)} – {formatTime(booking.ends_at)}
            </Chip>
            <Chip>{booking.booking_type === 'full_day' ? 'Full Day' : 'Time Slot'}</Chip>
            <Chip>{booking.guest_count} guests</Chip>
          </div>

          <div className="mt-auto flex items-center justify-end pt-6">
            <Button
              onClick={() =>
                requiresInstantPayment
                  ? navigate(`/payment/${booking.id}?type=full`)
                  : requiresAdvance
                    ? navigate(`/payment/${booking.id}?type=advance`)
                    : requiresBalance
                      ? navigate(`/payment/${booking.id}?type=balance`)
                      : navigate(`/bookings/${booking.id}`)
              }
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-ink-800 dark:bg-ink-850/60 dark:text-zinc-300">
      {children}
    </span>
  )
}
