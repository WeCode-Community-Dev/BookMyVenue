import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'

import { createClient, bookingEndpoints, venueEndpoints } from '@venue404/api-client'
import { AppNavbar } from '../components/shared/AppNavbar'
import {
  BookingHeader,
  BookingHero,
  VenueOverview,
  BookingDetailsSection,
  BookingActivity,
  BookingSummary,
  CancellationPolicySection,
} from '../components/booking-v2'

function BookingDetailV2Skeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="mb-8 h-6 w-32 animate-pulse rounded bg-zinc-100 dark:bg-ink-800" />
      <div className="h-64 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
      <div className="mt-12 h-80 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
      <div className="mt-12 h-96 animate-pulse rounded-xl bg-zinc-100 dark:bg-ink-800" />
    </div>
  )
}

function BookingNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-ink-850">
        <svg className="h-7 w-7 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <p className="mb-8 max-w-sm text-base leading-relaxed text-zinc-500">
        This booking may have been removed, or the link is no longer valid.
      </p>

      <button
        onClick={onBack}
        className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover"
      >
        Back to Bookings
      </button>
    </div>
  )
}

export default function BookingDetailV2() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const client = createClient()

  const bookingQuery = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingEndpoints(client).getBooking(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return 2000
      // Poll when awaiting owner acceptance or payment processing
      if (
        data.status === 'requested' ||
        data.status === 'owner_accepted' ||
        data.status === 'payment_pending' ||
        data.payment_status === 'unpaid' ||
        (data.status === 'confirmed' && data.payment_status === 'advance_paid')
      ) {
        return 2000
      }
      return false
    },
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
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <AppNavbar />
        <BookingDetailV2Skeleton />
      </div>
    )
  }

  if (bookingQuery.isError || venueQuery.isError || !booking || !venue) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <AppNavbar />
        <BookingNotFound onBack={() => navigate('/my-bookings')} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <AppNavbar />

      <div className="mx-auto max-w-[1440px] px-6">
        <BookingHeader />

        <BookingHero booking={booking} />

        {/* Full width */}
        <VenueOverview venue={venue} />

        {/* Two-column layout starts here */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-12">
            {/* Mobile summary */}
            <BookingSummary booking={booking} className="lg:hidden" />

            <BookingDetailsSection booking={booking} venue={venue} />

            {/* Chat Navigation Section */}
            <div className="bg-white dark:bg-ink-900 rounded-xl p-6 border border-zinc-200 dark:border-ink-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-zinc-100 dark:bg-ink-800 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Chat with venue owner
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Discuss booking details, ask questions, or request changes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/messages/${id}`)}
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Go to Chat
                </button>
              </div>
            </div>

            <BookingActivity booking={booking} venueTimezone={venue.timezone} />

            <CancellationPolicySection policy={venue.cancellation_policy} />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <BookingSummary booking={booking} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}