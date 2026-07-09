import { Link, useNavigate } from 'react-router-dom'

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

  const actionLabel = requiresInstantPayment
    ? 'Complete Payment'
    : requiresAdvance
      ? 'Pay Advance'
      : requiresBalance
        ? 'Pay Balance'
        : 'View Booking'

  return (
    <Card className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-ink-800 dark:bg-ink-900">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative shrink-0 md:w-[320px]">
          {booking.venue_cover_photo_url ? (
            <img
              src={booking.venue_cover_photo_url}
              alt={booking.venue_name}
              className="h-64 w-full object-cover md:h-full"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 md:h-full dark:from-ink-800 dark:to-ink-900">
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

          {(requiresInstantPayment || requiresAdvance || requiresBalance) && (
            <div className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow">
              Action Required
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <BookingStatusBadge status={booking.status} />

              <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {booking.venue_name}
              </h3>

              <p className="mt-1 text-sm text-zinc-500">{booking.venue_city}</p>
            </div>

            <div className="text-left lg:text-right">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{booking.display.quoted_price}</div>
              <div className="text-xs text-zinc-400">Total booking value</div>
            </div>
          </div>

          <div className="my-6 border-t border-zinc-100 dark:border-ink-800" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Event Date
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatDate(booking.starts_at)}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">Time</div>
              <div className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                {formatTime(booking.starts_at)} - {formatTime(booking.ends_at)}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Booking Type
              </div>
              <div className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                {booking.booking_type === 'full_day' ? 'Full Day' : 'Time Slot'}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Guests
              </div>
              <div className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{booking.guest_count} Guests</div>
            </div>
          </div>

          {(requiresInstantPayment || requiresAdvance || requiresBalance) && (
            <div className="mt-6 rounded-xl border border-brand-light-strong bg-brand-light p-4 dark:border-brand/30 dark:bg-brand/15">
              <div className="text-sm font-semibold text-brand dark:text-brand-secondary">Payment Required</div>
              <div className="mt-1 text-sm text-brand dark:text-brand-secondary">
                {requiresInstantPayment
                  ? 'Payment is required to secure this instant booking.'
                  : requiresAdvance
                    ? `Advance payment of ${booking.display.advance_due} is required to confirm this booking.`
                    : `Balance payment of ${booking.display.balance_due} is pending.`}
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center justify-end pt-8">
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
    </Card >
  )
}
