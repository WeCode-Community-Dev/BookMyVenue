import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { createClient, bookingEndpoints } from '@venue404/api-client'

import { EmptyState, ErrorState, Button, LoadingScreen } from '@venue404/ui'

import { AppNavbar } from '../components/shared/AppNavbar'

import type { BookingOut } from '../types'

import BookingCard from '../components/booking/BookingCard'
import BookingStatusBadge from '../components/booking/BookingStatusBadge'
import { UserReservations } from '../components/booking/UserReservations'

import { formatDate } from '../utils'

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

function FeaturedBookingHero({ booking }: { booking: BookingOut }) {
  return (
    <div className="mb-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-2">
        <div className="aspect-[16/9] lg:aspect-auto">
          {booking.venue_cover_photo_url ? (
            <img
              src={booking.venue_cover_photo_url}
              alt={booking.venue_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-zinc-100" />
          )}
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-10">
          <div className="mb-4">
            <BookingStatusBadge status={booking.status} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{booking.venue_name}</h2>

          <p className="mt-2 text-zinc-500">{booking.venue_city}</p>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">Event Date</p>

              <p className="mt-1 font-medium text-zinc-900">{formatDate(booking.starts_at)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-400">Booking Value</p>

              <p className="mt-1 font-medium text-zinc-900">{booking.display.quoted_price}</p>
            </div>
          </div>

          {(booking.status === 'owner_accepted' ||
             booking.status === 'payment_pending' ||
            (booking.status === 'confirmed' &&
              booking.payment_status === 'advance_paid' &&
              booking.balance_due_paise > 0)) && (
            <div className="mt-6 inline-flex w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
              Action Required
            </div>
          )}

          <Link to={`/bookings/${booking.id}`} className="mt-8">
            <Button>View Booking</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

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
        ${active ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}
      `}
    >
      {children}

      <span className="ml-2 text-zinc-400">{count}</span>

      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />}
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

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<BookingOut[]>({
    queryKey: ['my-bookings'],
    queryFn: () => bookingEndpoints(client).listBookings(),
  })

  const now = new Date()

  const upcomingBookings = bookings.filter(
    (booking) =>
      (booking.status === 'confirmed') &&
      new Date(booking.ends_at) > now
  )

  const pendingBookings = bookings.filter((booking) => booking.status === 'requested' || booking.status === 'payment_pending' || booking.status === 'owner_accepted')

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

  const featuredBooking = upcomingBookings[0]

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
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
    <div className="min-h-screen bg-zinc-50">
      <AppNavbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">My Bookings</h1>

          <p className="mt-2 max-w-2xl text-zinc-500">
            Manage reservations, complete payments and track upcoming events.
          </p>
        </div>

        {featuredBooking && <FeaturedBookingHero booking={featuredBooking} />}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              My Bookings
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-500">
              Manage reservations, complete payments, and track upcoming events.
            </p>
          </div>
          
          {/* Master View Switcher */}
          <div className="flex h-10 shrink-0 items-center rounded-xl bg-zinc-200/50 p-1">
            <button
              onClick={() => setMasterTab('bookings')}
              className={`flex h-full items-center rounded-lg px-4 text-sm font-semibold transition-all ${
                masterTab === 'bookings'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Platform Bookings
            </button>
            <button
              onClick={() => setMasterTab('reservations')}
              className={`flex h-full items-center rounded-lg px-4 text-sm font-semibold transition-all ${
                masterTab === 'reservations'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
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
            {featuredBooking && (
              <FeaturedBookingHero booking={featuredBooking} />
            )}

        <div className="mb-8 border-b border-zinc-200">
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
          </>
        )}
      </div>
    </div>
  )
}
