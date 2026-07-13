import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { createClient, bookingEndpoints, venueEndpoints } from '@venue404/api-client'

import { AppNavbar } from '../components/shared/AppNavbar'

import { CancellationPolicyCard } from '../components/venue/CancellationPolicyCard'

import { BookingStatusHero } from '../components/booking/BookingsStatusHero'
import { VenueSummaryCard } from '../components/booking/VenueSummaryCard'
import { BookingInformationCard } from '../components/booking/BookingInformationCard'
import { BookingTimelineCard } from '../components/booking/BookingTimelineCard'
import { PaymentSummaryCard } from '../components/booking/PaymentSummaryCard'
import { BookingActionsCard } from '../components/booking/BookingActionsCard'

function BookingDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 h-9 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-ink-800" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="h-44 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800" />
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800" />
          <div className="h-56 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800" />
          <div className="h-56 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800" />
        </div>

        <div className="w-full lg:w-[380px]">
          <div className="h-80 animate-pulse rounded-2xl bg-zinc-100 dark:bg-ink-800" />
        </div>
      </div>
    </div>
  )
}

function BookingNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-brand dark:bg-brand/15 dark:text-brand-secondary">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Booking not found
      </h2>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-500">
        This booking may have been removed, or the link is no longer valid.
      </p>

      <button
        onClick={onBack}
        className="press rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover"
      >
        Back to Bookings
      </button>
    </div>
  )
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const client = createClient()

  const bookingQuery = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingEndpoints(client).getBooking(id!),
    enabled: !!id,
  })

  const booking = bookingQuery.data

  const venueQuery = useQuery({
    queryKey: ['venue', booking?.venue_id],
    queryFn: () => venueEndpoints(client).getVenue(booking!.venue_id),
    enabled: !!booking?.venue_id,
  })

  const venue = venueQuery.data

  const isLoading = bookingQuery.isLoading || (booking && venueQuery.isLoading)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
        <AppNavbar />
        <BookingDetailSkeleton />
      </div>
    )
  }

  if (bookingQuery.isError || venueQuery.isError || !booking || !venue) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
        <AppNavbar />
        <BookingNotFound onBack={() => navigate('/my-bookings')} />
      </div>
    )
  }

  return (
    <div className="page-enter min-h-screen bg-zinc-50 dark:bg-ink-950">
      <AppNavbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-5 flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/my-bookings')}
            className="inline-flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            My Bookings
          </button>

          <svg
            className="h-3.5 w-3.5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

          <span className="font-medium text-zinc-900 dark:text-zinc-100">Booking Details</span>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <BookingStatusHero booking={booking} />
            <VenueSummaryCard venue={venue} />
            <BookingInformationCard booking={booking} venue={venue} />
            <BookingTimelineCard booking={booking} />
            <CancellationPolicyCard policy={venue.cancellation_policy} />
          </div>

          <aside className="w-full shrink-0 lg:w-[380px]">
            <div className="space-y-6 lg:sticky lg:top-[88px]">
              <PaymentSummaryCard booking={booking} />
              <BookingActionsCard booking={booking} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
