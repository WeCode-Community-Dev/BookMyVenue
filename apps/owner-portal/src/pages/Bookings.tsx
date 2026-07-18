import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import { StatusBadge, PaymentStatusBadge, EmptyState, Skeleton } from '@venue404/ui'
import { Search, Calendar, Users, ChevronDown } from 'lucide-react'
import { createClient, venueEndpoints, bookingEndpoints } from '@venue404/api-client'
import type { Booking, BookingListResponse } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'
import { Pagination } from '../components/Pagination'

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function formatEventDate(booking: Booking): string {
  if (!booking.starts_at) return '—'
  const d = new Date(booking.starts_at)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusVariant(status: string): 'success' | 'danger' | 'warning' | 'pending' | 'neutral' | 'info' {
  if (status === 'confirmed' || status === 'completed') return 'success'
  if (status === 'requested') return 'pending'
  if (status === 'owner_accepted') return 'warning'
  if (status.includes('cancelled') || status.includes('expired') || status === 'owner_rejected') return 'danger'
  return 'neutral'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    requested: 'Requested',
    owner_accepted: 'Accepted',
    confirmed: 'Confirmed',
    completed: 'Completed',
    user_cancelled: 'User Cancelled',
    owner_cancelled: 'Owner Cancelled',
    conflict_cancelled: 'Conflict Cancelled',
    balance_overdue_cancelled: 'Overdue Cancelled',
    owner_rejected: 'Rejected',
    expired: 'Expired',
  }
  return map[status] || status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const COL = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-400'
const CELL = 'px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300 align-middle'

export default function Bookings() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'all')
  const [search, setSearch] = useState('')
  const [selectedVenue, setSelectedVenue] = useState(searchParams.get('venue_id') || 'all')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const qTab = searchParams.get('tab')
    if (qTab && qTab !== tab) {
      setTab(qTab)
      setPage(1)
    }
  }, [searchParams, tab])

  useEffect(() => {
    setPortalTarget(document.getElementById('topbar-portal-target'))
  }, [])

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
  }, [search])

  const { data: venues = [] } = useQuery({
    queryKey: ['approved-venues'],
    queryFn: async () => {
      const data = await venueEndpoints(createClient()).getMyVenues()
      return (data || []).filter(v => v.is_active && v.status === 'approved')
    }
  })

  const { data: bookingResponse, isLoading: loading } = useQuery<BookingListResponse>({
    queryKey: ['owner-bookings', tab, selectedVenue, debouncedSearch, page],
    queryFn: async () => {
      const data = await bookingEndpoints(createClient()).getOwnerBookings({
        tab: tab !== 'all' ? tab : undefined,
        venue_id: selectedVenue !== 'all' ? selectedVenue : undefined,
        search: debouncedSearch || undefined,
        page,
        per_page: 25
      })
      return data
    }
  })

  const bookings = bookingResponse?.data || []
  const totalPages = bookingResponse?.meta?.total_pages || 1

  const TABS = [
    { id: 'all', label: 'All Bookings' },
    { id: 'requested', label: 'Pending' },
    { id: 'owner_accepted', label: 'On Hold' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

  const filtersNode = (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full shrink-0 justify-end">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-400" />
        <input
          type="text"
          placeholder="Search by venue or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 hover:border-zinc-300 dark:hover:border-ink-700 rounded-lg text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-zinc-400 dark:text-zinc-400"
        />
      </div>
      <div className="relative w-full sm:w-48">
        <button
          onClick={() => {
            const el = document.getElementById('venue-dropdown')
            if (el) el.classList.toggle('hidden')
          }}
          onBlur={() => {
            // Delay hiding slightly so clicks register
            setTimeout(() => {
              const el = document.getElementById('venue-dropdown')
              if (el) el.classList.add('hidden')
            }, 150)
          }}
          className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 hover:border-zinc-300 dark:hover:border-ink-700 rounded-lg text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-zinc-700 dark:text-zinc-300"
        >
          <span className="truncate">
            {selectedVenue === 'all' ? 'All Venues' : venues.find(v => v.id === selectedVenue)?.name || 'All Venues'}
          </span>
          <ChevronDown className="h-4 w-4 text-zinc-400 dark:text-zinc-400 shrink-0 ml-2" />
        </button>
        <div
          id="venue-dropdown"
          className="hidden absolute top-full left-0 mt-1 w-full bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 rounded-lg shadow-lg overflow-hidden z-50 py-1"
        >
          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-ink-800 transition-colors ${selectedVenue === 'all' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-zinc-700 dark:text-zinc-300'}`}
            onClick={() => {
              setSelectedVenue('all')
              setPage(1)
            }}
          >
            All Venues
          </button>
          {venues.map(v => (
            <button
              key={v.id}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-ink-800 transition-colors ${selectedVenue === v.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-zinc-700 dark:text-zinc-300'}`}
              onClick={() => {
                setSelectedVenue(v.id)
                setPage(1)
              }}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Filters */}
      {portalTarget ? createPortal(filtersNode, portalTarget) : (
        <div className="flex flex-col md:flex-row md:items-start justify-end gap-6 md:gap-4 mb-2">
          {filtersNode}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-ink-700">
        <nav className="-mb-px flex w-full overflow-x-auto no-scrollbar" aria-label="Tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 whitespace-nowrap py-3 border-b-2 font-medium text-sm transition-all ${
                tab === t.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-ink-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-ink-800 border-b border-zinc-200 dark:border-ink-700">
              <tr>
                {['Venue', 'Customer', 'Event Date', 'Booking Status', 'Payment', 'Guests', 'Requested', ''].map(h => (
                  <th key={h} className={COL}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-ink-800">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className={CELL}><Skeleton className="h-4 w-28" /></td>
                  <td className={CELL}><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-32" /></td>
                  <td className={CELL}><Skeleton className="h-4 w-20" /></td>
                  <td className={CELL}><Skeleton className="h-6 w-24 rounded-full" /></td>
                  <td className={CELL}><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className={CELL}><Skeleton className="h-4 w-6" /></td>
                  <td className={CELL}><Skeleton className="h-4 w-14" /></td>
                  <td className={CELL}><Skeleton className="h-4 w-12" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10 text-zinc-400 dark:text-zinc-400" />}
          title="No bookings found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-zinc-50 dark:bg-ink-800 border-b border-zinc-200 dark:border-ink-700">
              <tr>
                <th className={COL}>Venue</th>
                <th className={COL}>Customer</th>
                <th className={COL}>Event Date</th>
                <th className={COL}>Booking Status</th>
                <th className={COL}>Payment</th>
                <th className={COL}>Guests</th>
                <th className={COL}>Requested</th>
                <th className={COL}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-ink-800">
              {bookings.map(booking => (
                <tr
                  key={booking.id}
                  className="hover:bg-zinc-50/70 dark:hover:bg-ink-800 transition-colors"
                >
                  {/* Venue */}
                  <td className={CELL}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-ink-800 flex items-center justify-center shrink-0 text-zinc-400 dark:text-zinc-400">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        {booking.venue_name || 'Unknown Venue'}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className={CELL}>
                    <div className="font-medium text-zinc-800 dark:text-zinc-200 leading-tight">
                      {booking.user_full_name || 'Guest'}
                    </div>
                  </td>

                  {/* Event Date */}
                  <td className={`${CELL} whitespace-nowrap text-zinc-600 dark:text-zinc-400`}>
                    {formatEventDate(booking)}
                  </td>

                  {/* Booking Status */}
                  <td className={CELL}>
                    <StatusBadge
                      label={statusLabel(booking.status)}
                      variant={statusVariant(booking.status)}
                    />
                  </td>

                  {/* Payment */}
                  <td className={CELL}>
                    <PaymentStatusBadge status={booking.payment_status ?? ''} />
                  </td>

                  {/* Guests */}
                  <td className={CELL}>
                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                      <Users className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-400" />
                      <span>{booking.guest_count ?? '—'}</span>
                    </div>
                  </td>

                  {/* Requested */}
                  <td className={`${CELL} whitespace-nowrap text-zinc-400 dark:text-zinc-400 text-xs`}>
                    {booking.created_at ? timeAgo(booking.created_at) : '—'}
                  </td>

                  {/* Details link */}
                  <td className={CELL}>
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline underline-offset-2 transition-colors whitespace-nowrap"
                      onClick={e => e.stopPropagation()}
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <Pagination
            page={page}
            perPage={25}
            total={bookingResponse?.meta?.total || 0}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  )
}
