import { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { createClient, bookingEndpoints, paymentEndpoints } from '@venue404/api-client'
import { Logo } from '@venue404/ui'

import { StripePaymentForm } from '../components/StripePaymentForm'
import { QuoteBreakdown } from '../components/venue/QuoteBreakdown'

import { formatDate, formatTime, formatPrice } from '../utils'
import type { BookingOut } from '../types'

type PaymentType = 'advance' | 'balance' | 'full'

// ─── Booking summary sidebar ──────────────────────────────────────────────────
function BookingSummaryCard({ booking }: { booking: BookingOut }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
      {/* Cover image */}
      <div className="relative h-48 bg-zinc-100 dark:bg-ink-800">
        {booking.venue_cover_photo_url ? (
          <img
            src={booking.venue_cover_photo_url}
            alt={booking.venue_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-8 w-8 text-zinc-300"
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
      </div>

      <div className="p-5">
        <h3 className="text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{booking.venue_name}</h3>

        {/* Date / time / guests */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(booking.starts_at)}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400"
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
            {booking.booking_type === 'time_slot'
              ? `${formatTime(booking.starts_at)} – ${formatTime(booking.ends_at)}`
              : 'Full day'}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {booking.guest_count} guest{booking.guest_count !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="my-5 border-t border-zinc-100 dark:border-ink-800" />

        <QuoteBreakdown
          source="booking"
          display={booking.display}
          balanceDueDate={booking.balance_due_date}
        />
      </div>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function PaymentSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
        <div className="flex-1 min-w-0 space-y-5">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-zinc-100 dark:bg-ink-800" />
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800" />
        </div>
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800" />
        </div>
      </div>
    </div>
  )
}

// ─── Intent loading / error placeholders ─────────────────────────────────────
function IntentLoadingRow() {
  return (
    <div className="flex items-center justify-center gap-2.5 py-8 text-sm text-zinc-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 dark:border-ink-700 border-t-zinc-500" />
      Loading secure payment…
    </div>
  )
}

function IntentErrorRow({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-4">
      <div
        role="alert"
        className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
      >
        <svg
          className="mt-0.5 h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        We couldn't start your payment. Please try again.
      </div>
      <button
        onClick={onRetry}
        className="w-full rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800"
      >
        Try again
      </button>
    </div>
  )
}

// ─── Not-found state ──────────────────────────────────────────────────────────
function BookingNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-ink-800">
        <svg
          className="h-7 w-7 text-zinc-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Booking not found</h2>
      <p className="mt-2 text-sm text-zinc-400">The booking may have been removed.</p>
      <button
        onClick={onBack}
        className="press mt-8 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
      >
        Back to Bookings
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Payment() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const client = createClient()

  const paymentType = ['advance', 'balance', 'full'].includes(searchParams.get('type') ?? '')
    ? (searchParams.get('type') as PaymentType)
    : 'advance'

  const bookingQuery = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingEndpoints(client).getBooking(bookingId!),
    enabled: !!bookingId,
  })

  const booking = bookingQuery.data as BookingOut | undefined

  const isAdvanceDue =
    booking != null &&
    (booking.status === 'owner_accepted' || booking.status === 'payment_pending') &&
    booking.advance_due_paise > 0

  const isBalanceDue =
    booking != null &&
    booking.status === 'confirmed' &&
    booking.payment_status === 'advance_paid' &&
    booking.balance_due_paise > 0

  const isFullDue =
    booking != null &&
    ((booking.status === 'payment_pending' && booking.payment_required) ||
      (booking.status === 'owner_accepted' && booking.advance_pct === 100))

  const isPaymentDue =
    paymentType === 'balance'
      ? isBalanceDue
      : paymentType === 'full'
        ? isFullDue
        : isAdvanceDue

  const intentQuery = useQuery({
    queryKey: ['payment-intent', bookingId, paymentType],
    queryFn: () =>
      paymentEndpoints(client).createPaymentIntent(bookingId!, {
        payment_type: paymentType,
      }),
    enabled: !!bookingId && !!booking && isPaymentDue,
    retry: false,
  })

  useEffect(() => {
    if (booking && !isPaymentDue) {
      navigate(`/payment/result?booking_id=${booking.id}`, { replace: true })
    }
  }, [booking, isPaymentDue, navigate])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (bookingQuery.isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50/60 dark:bg-ink-950">
        {/* Minimal payment navbar */}
        <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm dark:border-ink-800 dark:bg-ink-950/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
            <Link to="/">
              <Logo />
            </Link>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure payment
            </div>
            <div className="w-16" />
          </div>
        </header>
        <PaymentSkeleton />
      </div>
    )
  }

  // ── Error / not found ────────────────────────────────────────────────────
  if (bookingQuery.isError || !booking) {
    return (
      <div className="min-h-screen bg-zinc-50/60 dark:bg-ink-950">
        <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm dark:border-ink-800 dark:bg-ink-950/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
            <Link to="/">
              <Logo />
            </Link>
            <div className="w-16" />
            <div className="w-16" />
          </div>
        </header>
        <BookingNotFound onBack={() => navigate('/my-bookings')} />
      </div>
    )
  }

  const isFullPayment = paymentType === 'full' || booking.advance_pct === 100
  const amountDuePaise =
    paymentType === 'balance'
      ? booking.balance_due_paise
      : paymentType === 'full'
        ? booking.quoted_price_paise
        : booking.advance_due_paise
  const payLabel = formatPrice(amountDuePaise)

  const heading =
    paymentType === 'balance'
      ? 'Pay your balance'
      : paymentType === 'full' || isFullPayment
        ? 'Complete your payment'
        : 'Pay the token advance'

  const subheading =
    paymentType === 'balance'
      ? 'Settle the remaining amount to complete your booking.'
      : paymentType === 'full'
        ? 'Pay the full booking amount now to secure this reservation.'
        : 'Pay the advance to confirm your slot. The balance is due closer to the date.'

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-ink-950">
      {/* ── Minimal payment navbar ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm dark:border-ink-800 dark:bg-ink-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure payment
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors dark:hover:text-zinc-200"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* ── Two-column body ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
          {/* ── Left: payment form ─────────────────────────────────────── */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Heading */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{heading}</h1>
              <p className="mt-1.5 text-sm text-zinc-500">{subheading}</p>
            </div>

            {/* Amount + form card */}
            <div className="space-y-5 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
              {/* Amount row */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-ink-800">
                <span className="text-sm font-medium text-zinc-500">Amount due</span>
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{payLabel}</span>
              </div>

              {intentQuery.isLoading && <IntentLoadingRow />}

              {intentQuery.isError && <IntentErrorRow onRetry={() => intentQuery.refetch()} />}

              {intentQuery.data?.client_secret && (
                <StripePaymentForm
                  clientSecret={intentQuery.data.client_secret}
                  payLabel={payLabel}
                  onSuccess={() => navigate(`/payment/result?booking_id=${booking.id}`)}
                  onCancel={() => navigate(`/bookings/${booking.id}`)}
                />
              )}
            </div>

            {/* Stripe trust line */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <svg
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Payments are encrypted and processed securely by Stripe.
            </div>
          </div>

          {/* ── Right: sticky booking summary ──────────────────────────── */}
          <div className="w-full shrink-0 lg:w-[380px] lg:sticky lg:top-[80px]">
            <BookingSummaryCard booking={booking} />
          </div>
        </div>
      </div>
    </div>
  )
}
