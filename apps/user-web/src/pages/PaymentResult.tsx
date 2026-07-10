import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createClient, bookingEndpoints } from '@venue404/api-client'
import { AppNavbar } from '../components/shared/AppNavbar'
import { formatTime, formatDate, formatPrice } from '../utils'

// ─── Loading ──────────────────────────────────────────────────────────────────
function VerifyingState() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light dark:bg-brand/15">
        <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand/30 border-t-brand" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Securing your time slot…
      </h2>
      <p className="mt-2 text-sm text-zinc-400 max-w-xs mx-auto">
        We're verifying your payment and locking the venue block. This usually takes a moment.
      </p>
    </div>
  )
}

// ─── Error ────────────────────────────────────────────────────────────────────
function VerifyError({
  onRetry,
  onGoToBookings,
}: {
  onRetry: () => void
  onGoToBookings: () => void
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-ink-700">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-ink-800">
          <svg
            className="h-6 w-6 text-zinc-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Unable to verify payment
        </p>
        <p className="mt-1 text-sm text-zinc-400">We had trouble checking your booking status.</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="press rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
          >
            Retry verification
          </button>
          <button
            onClick={onGoToBookings}
            className="press rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
          >
            My bookings
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const client = createClient()
  const bookingId = searchParams.get('booking_id')

  const {
    data: booking,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingEndpoints(client).getBooking(bookingId!),
    enabled: !!bookingId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return 2000
      if (
        data.status === 'owner_accepted' ||
        data.status === 'requested' ||
        data.payment_status === 'unpaid' ||
        data.payment_status === 'pending' ||
        (data.status === 'confirmed' && data.payment_status === 'advance_paid')
      ) {
        return 2000
      }
      return false
    },
  })

  useEffect(() => {
    if (!bookingId) navigate('/')
  }, [bookingId, navigate])

  if (isLoading || !booking) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
        <AppNavbar />
        <VerifyingState />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
        <AppNavbar />
        <VerifyError
          onRetry={() => void refetch()}
          onGoToBookings={() => navigate('/my-bookings')}
        />
      </div>
    )
  }

  const isConfirmed = booking.status === 'confirmed' || booking.status === 'completed'
  const isFullyPaid = booking.payment_status === 'fully_paid'
  const isCancelled = booking.status === 'conflict_cancelled' || booking.status === 'user_cancelled'
  const isPending = !isConfirmed && !isFullyPaid && !isCancelled

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
      <AppNavbar />

      <div className="page-enter mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center px-6 py-16">
        <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
          {/* ── Status icon block ────────────────────────────────────────── */}
          <div
            className={[
              'flex flex-col items-center border-b px-8 pt-12 pb-10 text-center',
              isCancelled
                ? 'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/15'
                : isPending
                  ? 'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/15'
                  : 'bg-brand-light border-brand-light-strong dark:bg-brand/15 dark:border-brand/20',
            ].join(' ')}
          >
            {isCancelled ? (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15">
                  <svg
                    className="h-9 w-9 text-rose-600 dark:text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Slot unavailable
                </h2>
                <p className="mt-2 text-sm text-zinc-500 max-w-xs">
                  Another booking confirmed this slot right before your payment went through. Any
                  amount deducted has been refunded to your original payment method.
                </p>
              </>
            ) : isPending ? (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15">
                  <svg
                    className="h-9 w-9 text-amber-500 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Confirming payment…
                </h2>
                <p className="mt-2 text-sm text-zinc-500 max-w-xs">
                  Stripe is still processing your transaction. This page will update automatically.
                </p>
              </>
            ) : (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 dark:bg-brand/20">
                  <svg
                    className="h-9 w-9 text-brand dark:text-brand-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {isFullyPaid ? `Fully paid — you're all set!` : `Booking confirmed!`}
                </h2>
                <p className="mt-2 text-sm text-zinc-500 max-w-xs">
                  {isFullyPaid
                    ? 'Your venue is locked in and fully settled.'
                    : 'Your payment was processed. Your venue reservation is now locked in.'}
                </p>
              </>
            )}
          </div>

          {/* ── Booking details (success only) ───────────────────────────── */}
          {(isConfirmed || isFullyPaid) && (
            <div className="px-8 py-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Booking details
              </p>

              <div className="space-y-3">
                {[
                  { label: 'Venue', value: booking.venue_name },
                  { label: 'Location', value: booking.venue_city },
                  { label: 'Date', value: formatDate(booking.starts_at) },
                  {
                    label: 'Time',
                    value: `${formatTime(booking.starts_at)} – ${formatTime(booking.ends_at)}`,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">{label}</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {value}
                    </span>
                  </div>
                ))}

                {/* Amount paid — emphasised */}
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-ink-800">
                  <span className="text-sm text-zinc-500">Amount paid</span>
                  <span className="text-base font-semibold text-brand dark:text-brand-secondary">
                    {formatPrice(booking.amount_paid_paise)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 border-t border-zinc-100 px-8 py-6 sm:flex-row dark:border-ink-800">
            <button
              onClick={() => navigate(`/bookings/${booking.id}`)}
              className="press flex flex-1 items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
            >
              View booking
            </button>
            <button
              onClick={() => navigate('/')}
              className="press flex flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
