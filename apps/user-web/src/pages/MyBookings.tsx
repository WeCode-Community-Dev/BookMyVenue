import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { createClient, bookingEndpoints } from '@venue404/api-client'

import { EmptyState, ErrorState, Button, LoadingScreen } from '@venue404/ui'

import { AppNavbar } from '../components/shared/AppNavbar'
import { HomeFooter } from '../components/home/HomeFooter'

import type { BookingOut } from '../types'

import BookingCard from '../components/booking/BookingCard'

import { UserReservations } from '../components/booking/UserReservations'



type BookingTab = 'upcoming' | 'pending' | 'past' | 'cancelled'

const CANCELLED_STATUSES = [
  'user_cancelled',
  'admin_cancelled',
  'owner_rejected',
  'conflict_cancelled',
  'hold_expired',
  'request_expired',
  'balance_overdue_cancelled',
]


function TabButton({
  active,
  count,
  children,
  onClick,
}: {
  active: boolean
  count: number
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative pb-4 text-sm font-medium transition-colors
        ${active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}
      `}
    >
      {children}

      <span className="ml-2 text-zinc-400">{count}</span>

      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
    </button>
  )
}

export default function MyBookings() {
  const client = createClient()
  const location = useLocation()

  const [masterTab, setMasterTab] = useState<'bookings' | 'reservations'>(
    location.state?.tab === 'reservations' ? 'reservations' : 'bookings'
  )

  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming')

  const [page, setPage] = useState(1)
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-bookings', page],
    queryFn: () => bookingEndpoints(client).listBookings({ page, per_page: 10 }),
  })

  const bookings = data?.data || []
  const meta = data?.meta

  const now = new Date()

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === 'confirmed' && new Date(booking.ends_at) > now
  )

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === 'requested' ||
      booking.status === 'payment_pending' ||
      booking.status === 'owner_accepted'
  )

  const pastBookings = bookings.filter((booking) => booking.status === 'completed')

  const cancelledBookings = bookings.filter((booking) =>
    CANCELLED_STATUSES.includes(booking.status)
  )

  
  const filteredBookings = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBookings

      case 'pending':
        return pendingBookings

      case 'past':
        return pastBookings

      case 'cancelled':
        return cancelledBookings

      default:
        return []
    }
  }, [activeTab, upcomingBookings, pendingBookings, pastBookings, cancelledBookings])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <AppNavbar />

        <div className="mx-auto max-w-6xl px-4 py-8">
          <ErrorState
            title="Unable to load bookings"
            message="Failed to load your bookings."
            action={<Button onClick={() => void refetch()}>Retry</Button>}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-ink-950">
      <AppNavbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              My Bookings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Manage reservations, complete payments, and track upcoming events.
            </p>
          </div>

          {/* Master View Switcher */}
          <div className="flex h-10 shrink-0 items-center rounded-xl bg-zinc-200/50 p-1 dark:bg-ink-800">
            <button
              onClick={() => setMasterTab('bookings')}
              className={`flex h-full items-center rounded-lg px-4 text-sm font-semibold transition-all ${
                masterTab === 'bookings'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-ink-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Platform Bookings
            </button>
            <button
              onClick={() => setMasterTab('reservations')}
              className={`flex h-full items-center rounded-lg px-4 text-sm font-semibold transition-all ${
                masterTab === 'reservations'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-ink-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Venue Requests
            </button>
          </div>
        </div>

        {masterTab === 'reservations' ? (
          <UserReservations />
        ) : (
          <>
            {/* {featuredBooking && (
              <FeaturedBookingHero booking={featuredBooking} />
            )} */}

            <div className="mb-8 border-b border-zinc-200 dark:border-ink-700">
              <div className="flex gap-8 overflow-x-auto">
                <TabButton
                  active={activeTab === 'upcoming'}
                  count={upcomingBookings.length}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </TabButton>

                <TabButton
                  active={activeTab === 'pending'}
                  count={pendingBookings.length}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending
                </TabButton>

                <TabButton
                  active={activeTab === 'past'}
                  count={pastBookings.length}
                  onClick={() => setActiveTab('past')}
                >
                  Past
                </TabButton>

                <TabButton
                  active={activeTab === 'cancelled'}
                  count={cancelledBookings.length}
                  onClick={() => setActiveTab('cancelled')}
                >
                  Cancelled
                </TabButton>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <EmptyState
                title={`No ${activeTab} bookings`}
                description="Bookings will appear here once available."
              />
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}

            {meta && meta.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-ink-700">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(p - 1, 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={page === 1}
                  className="press rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-ink-700 dark:text-zinc-300 dark:hover:bg-ink-800"
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-500">
                  Page {page} of {meta.total_pages}
                </span>
                <button
                  onClick={() => {
                    setPage((p) => Math.min(p + 1, meta.total_pages))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={page === meta.total_pages}
                  className="press rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-ink-700 dark:text-zinc-300 dark:hover:bg-ink-800"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <HomeFooter />
    </div>
  )
}
