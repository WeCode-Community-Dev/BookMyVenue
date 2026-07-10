import { useState } from 'react'

type BookingMode = 'MANUAL' | 'INSTANT'
type InstantPaymentChoice = 'advance' | 'full'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createClient, bookingEndpoints } from '@venue404/api-client'
import { Logo } from '@venue404/ui'
import { formatDate, formatTime, formatPrice } from '../utils'
import type { PricingQuote, BookingType } from '../types'
import { QuoteBreakdown } from '../components/venue/QuoteBreakdown'

// ─── Types ────────────────────────────────────────────────────────────────────
type CheckoutState = {
  venueId: string
  venueName: string
  venueCoverImage: string | null
  bookingMode?: BookingMode
  userStartsAt: string
  userEndsAt: string
  bookingType: BookingType
  startsAt: string
  endsAt: string
  bookingDate: string
  quote: PricingQuote | undefined
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-secondary dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-100'

// ─── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      {children}
    </div>
  )
}

// ─── Primary CTA button ───────────────────────────────────────────────────────
function BookButton({
  pending,
  instant,
  onClick,
}: {
  pending: boolean
  instant: boolean
  onClick: () => void
}) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={pending}
        className="press flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-semibold text-white shadow-sm outline-none transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Spinner /> Sending request…
          </>
        ) : instant ? (
          'Book Instantly'
        ) : (
          'Request to Book'
        )}
      </button>
      <p className="mt-2 text-center text-xs text-zinc-400">
        {instant
          ? 'Payment is required to confirm this instant booking'
          : 'No charge until owner accepts'}
      </p>
    </>
  )
}

// ─── Booking summary sidebar card (Multi-day + TimeSlot Fixed) ────────────────
function BookingSummaryCard({ state, guestCount }: { state: CheckoutState; guestCount: number }) {
  const { venueName, venueCoverImage, bookingType, userStartsAt, userEndsAt, quote } = state

  const rangeLabel =
    userStartsAt && userEndsAt
      ? `${formatDate(userStartsAt)} — ${formatDate(userEndsAt)}`
      : formatDate(state.bookingDate)

  const timeLabel =
    bookingType === 'time_slot' && userStartsAt && userEndsAt
      ? `${formatTime(userStartsAt)} – ${formatTime(userEndsAt)}`
      : bookingType === 'full_day'
        ? 'Full day'
        : ''


  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
      {/* Venue image (unchanged) */}
      <div className="relative h-48 bg-zinc-100 dark:bg-ink-800">
        {venueCoverImage ? (
          <img src={venueCoverImage} alt={venueName} loading="lazy" className="h-full w-full object-cover" />
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
        <h3 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{venueName}</h3>

        <div className="mt-3 space-y-1.5">
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
            {rangeLabel}
          </div>

          {timeLabel && (
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
              {timeLabel}
            </div>
          )}

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
            {guestCount} guest{guestCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="my-5 border-t border-zinc-100 dark:border-ink-800" />

        {quote ? (
          <QuoteBreakdown source="quote" quote={quote} />
        ) : (
          <p className="py-4 text-sm text-zinc-500">
            Price details will be available after owner confirmation.
          </p>
        )}

        {quote && (
          <div className="mt-4 rounded-xl border border-brand-light-strong bg-brand-light px-4 py-3 dark:border-brand/30 dark:bg-brand/15">
            <p className="text-sm font-semibold text-brand dark:text-brand-secondary">
              {formatPrice(quote.advance_due_paise)} due now
            </p>
            <p className="mt-0.5 text-xs text-brand-secondary">
              After owner accepts · remaining {formatPrice(quote.balance_due_paise)} paid later
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── "What happens next" steps ─────────────────────────────────────────────────
function NextSteps({ quote }: { quote: PricingQuote | undefined }) {
  const steps = [
    {
      n: '1',
      title: 'Request sent',
      desc: 'The venue owner will be notified of your booking request.',
    },
    {
      n: '2',
      title: 'Owner confirms',
      desc: `The owner has ${quote ? '48' : '—'} hours to accept or decline.`,
    },
    {
      n: '3',
      title: 'Pay the advance',
      desc: `Once accepted, you'll pay ${formatPrice(quote?.advance_due_paise || 0)} to confirm your slot.`,
    },
    {
      n: '4',
      title: 'Balance due later',
      desc: `The remaining ${formatPrice(quote?.balance_due_paise || 0)} is due before your event date.`,
    },
  ]

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">What happens next</h2>
      <ol className="space-y-4">
        {steps.map((item) => (
          <li key={item.n} className="flex gap-3.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {item.n}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{item.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function InstantNextSteps({ quote }: { quote: PricingQuote | undefined }) {
  const steps = [
    {
      n: '1',
      title: 'Slot reserved',
      desc: 'We briefly hold this slot while you complete payment.',
    },
    {
      n: '2',
      title: 'Choose payment',
      desc: `Pay ${formatPrice(quote?.advance_due_paise || 0)} advance or the full amount now.`,
    },
    {
      n: '3',
      title: 'Instant confirmation',
      desc: 'Your booking is confirmed automatically after successful payment.',
    },
  ]

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">What happens next</h2>
      <ol className="space-y-4">
        {steps.map((item) => (
          <li key={item.n} className="flex gap-3.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              {item.n}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{item.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ─── Empty / guard state ──────────────────────────────────────────────────────
function NoBookingState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center dark:bg-ink-950">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-ink-800">
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">No booking details found</h2>
      <p className="mb-6 max-w-sm text-sm text-zinc-500">
        Please start your booking from a venue page.
      </p>
      <button
        onClick={onBrowse}
        className="press rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
      >
        Browse venues
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const client = createClient()

  const state = location.state as CheckoutState | undefined
  const [guestCount, setGuestCount] = useState(1)
  const [eventType, setEventType] = useState('')
  const [userNotes, setUserNotes] = useState('')
  const [paymentChoice, setPaymentChoice] = useState<InstantPaymentChoice>('advance')

  const isInstantBooking = state?.bookingMode === 'INSTANT'

  const createBooking = useMutation({
    mutationFn: () =>
      bookingEndpoints(client).createBooking({
        venue_id: state!.venueId,
        venue_name: state!.venueName,
        venue_cover_image: state!.venueCoverImage,
        booking_type: state!.bookingType,
        starts_at: state!.userStartsAt,
        ends_at: state!.userEndsAt,
        booking_date: state!.bookingDate,
        guest_count: guestCount,
        event_type: eventType.trim() || null,
        user_notes: userNotes.trim() || null,
      }),
    onSuccess: (booking) => {
      if (isInstantBooking) {
        navigate(`/payment/${booking.id}?type=${paymentChoice}`)
        return
      }

      navigate(`/bookings/${booking.id}`)
    },
  })

  // ── Guard: no state ────────────────────────────────────────────────────
  if (!state) {
    return <NoBookingState onBrowse={() => navigate('/')} />
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-ink-950">
      {/* Header unchanged */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm dark:border-ink-800 dark:bg-ink-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {isInstantBooking ? 'Complete your booking' : 'Confirm your request'}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Two-column body */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start gap-10 lg:flex-row xl:gap-14">
          {/* Left form (unchanged) */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* ... your existing form content ... */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {isInstantBooking ? 'Complete Payment' : 'Request to book'}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500">
                {isInstantBooking
                  ? 'Choose how much to pay now. Your booking is confirmed after payment.'
                  : 'No payment taken now - the owner will confirm your request first.'}
              </p>
              <p className="hidden">
                No payment taken now — the owner will confirm your request first.
              </p>
            </div>
            {/* ── Guest count ─────────────────────────────────── */}
            <SectionCard>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Your booking</h2>

              <div>
                <FieldLabel htmlFor="guest_count">Number of guests</FieldLabel>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuestCount((n) => Math.max(1, n - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-ink-700 dark:text-zinc-400 dark:hover:border-ink-600 dark:hover:text-zinc-100"
                    aria-label="Decrease guests"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    id="guest_count"
                    type="number"
                    min={1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 rounded-lg border border-zinc-200 px-2 py-2 text-center text-base font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => setGuestCount((n) => n + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-ink-700 dark:text-zinc-400 dark:hover:border-ink-600 dark:hover:text-zinc-100"
                    aria-label="Increase guests"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </SectionCard>

            {/* ── Event details ────────────────────────────────── */}
            {isInstantBooking && state.quote && (
              <SectionCard>
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Choose Payment</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Pay the advance to reserve now, or settle the full amount in one payment.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: 'advance' as const,
                      title: 'Pay Advance',
                      amount: formatPrice(state.quote.advance_due_paise),
                    },
                    {
                      value: 'full' as const,
                      title: 'Pay Full Amount',
                      amount: formatPrice(state.quote.quoted_price_paise),
                    },
                  ].map((option) => {
                    const selected = paymentChoice === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPaymentChoice(option.value)}
                        className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                          selected
                            ? 'border-brand bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-300 dark:hover:bg-ink-800'
                        }`}
                      >
                        <span className="block text-sm font-semibold">{option.title}</span>
                        <span className="mt-1 block text-lg font-bold">{option.amount}</span>
                      </button>
                    )
                  })}
                </div>
              </SectionCard>
            )}

            <SectionCard>
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Event details</h2>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Optional — helps the owner prepare for your event
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="event_type">Event type</FieldLabel>
                <input
                  id="event_type"
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="e.g. Birthday party, Corporate offsite, Wedding"
                  className={inputCls}
                />
              </div>

              <div>
                <FieldLabel htmlFor="user_notes">Notes for the owner</FieldLabel>
                <textarea
                  id="user_notes"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  rows={4}
                  placeholder="Anything the owner should know — setup requirements, special requests, access needs…"
                  className={inputCls}
                />
              </div>
            </SectionCard>

            {/* ── What happens next ────────────────────────────── */}
            {isInstantBooking ? (
              <InstantNextSteps quote={state.quote} />
            ) : (
              <NextSteps quote={state.quote} />
            )}

            {/* Error Banner */}
            {createBooking.isError && (
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium">Failed to send booking request</p>
                  <p className="mt-0.5">
                    {(createBooking.error instanceof Error ? createBooking.error.message : null) || 'Please try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* CTA mobile */}
            <div className="lg:hidden">
              <BookButton
                pending={createBooking.isPending}
                instant={isInstantBooking}
                onClick={() => createBooking.mutate()}
              />
            </div>
          </div>

          {/* Right: sticky summary */}
          <div className="w-full shrink-0 lg:sticky lg:top-[80px] lg:w-[380px] xl:w-[400px]">
            <BookingSummaryCard state={state} guestCount={guestCount} />

            {/* CTA desktop */}
            <div className="mt-4 hidden lg:block">
              <BookButton
                pending={createBooking.isPending}
                instant={isInstantBooking}
                onClick={() => createBooking.mutate()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
