import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'

import { HomeNavbar } from '../components/home/HomeNavbar'
import { FilterHero } from '../components/home/HeroSearch'
import { VenueGrid } from '../components/home/VenueGrid'
import { HomeFooter } from '../components/home/HomeFooter'

const PAGE_SIZE = 25

type SortKey = 'recommended' | 'price_asc' | 'price_desc' | 'capacity_desc'

async function fetchVenuePage(params: URLSearchParams, cursor: string | undefined) {
  const client = createClient()
  const query: Record<string, string> = {
    page_size: String(PAGE_SIZE),
    sort: params.get('sort') || 'recommended',
  }
  if (params.get('q')) query.q = params.get('q')!
  if (params.get('city')) query.city = params.get('city')!
  if (params.get('venue_type')) query.venue_type = params.get('venue_type')!
  if (params.get('capacity')) query.capacity = params.get('capacity')!
  if (params.get('instant_booking')) query.instant_booking = params.get('instant_booking')!
  if (cursor) query.cursor = cursor
  return venueEndpoints(client).hybrid_search(query)
}

export default function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Draft fields, kept in sync with the URL whenever it changes externally
  // (sidebar click, browser back/forward, etc.) — q included now.
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [capacity, setCapacity] = useState(searchParams.get('capacity') ?? '')

  useEffect(() => {
    setQ(searchParams.get('q') ?? '')
    setCity(searchParams.get('city') ?? '')
    setCapacity(searchParams.get('capacity') ?? '')
  }, [searchParams])

  const venueType = searchParams.get('venue_type') ?? ''
  const instantBooking = searchParams.get('instant_booking') === 'true'
  const sort = (searchParams.get('sort') as SortKey) ?? 'recommended'

  // Cursor-paginated via useInfiniteQuery — the query key includes every
  // filter/sort param, so changing any of them starts a fresh page 1 instead
  // of appending onto stale results.
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['venues', 'search', searchParams.toString()],
    queryFn: ({ pageParam }) => fetchVenuePage(searchParams, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? (lastPage.next_cursor ?? undefined) : undefined,
  })

  const venues = data?.pages.flatMap((p) => p.items) ?? []
  const total = data?.pages[0]?.total ?? null

  function buildParams(
    overrides: Partial<{
      q: string
      city: string
      venue_type: string
      capacity: string
      instant_booking: boolean
      sort: SortKey
    }> = {}
  ) {
    const merged = {
      q: overrides.q ?? q,
      city: overrides.city ?? city,
      venue_type: overrides.venue_type ?? venueType,
      capacity: overrides.capacity ?? capacity,
      instant_booking: overrides.instant_booking ?? instantBooking,
      sort: overrides.sort ?? sort,
    }
    const next: Record<string, string> = {}
    if (merged.q) next.q = merged.q
    if (merged.city) next.city = merged.city
    if (merged.venue_type) next.venue_type = merged.venue_type
    if (merged.capacity) next.capacity = merged.capacity
    if (merged.instant_booking) next.instant_booking = 'true'
    if (merged.sort && merged.sort !== 'recommended') next.sort = merged.sort
    return next
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearchParams(buildParams())
  }

  function handleVenueTypeChange(type: string) {
    setSearchParams(buildParams({ venue_type: type }))
  }

  function handleCapacityChange(value: string) {
    setCapacity(value)
    setSearchParams(buildParams({ capacity: value }))
  }

  function handleInstantBookingChange(value: boolean) {
    setSearchParams(buildParams({ instant_booking: value }))
  }

  function handleSortChange(value: SortKey) {
    setSearchParams(buildParams({ sort: value }))
  }

  function handleClearFilters() {
    setQ('')
    setCity('')
    setCapacity('')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <HomeNavbar />

      <FilterHero
        q={q}
        venueType={venueType}
        city={city}
        onQChange={setQ}
        onCityChange={setCity}
        onSubmit={handleSearchSubmit}
      />

      <VenueGrid
        venues={venues}
        total={total}
        loading={isLoading}
        error={isError ? ((error as Error)?.message ?? 'Failed to load venues.') : null}
        hasFilters={true}
        venueType={venueType}
        capacity={capacity}
        instantBooking={instantBooking}
        sort={sort}
        hasMore={!!hasNextPage}
        loadingMore={isFetchingNextPage}
        onVenueClick={(id) => navigate(`/venues/${id}`)}
        onRetry={refetch}
        onClearFilters={handleClearFilters}
        onVenueTypeChange={handleVenueTypeChange}
        onCapacityChange={handleCapacityChange}
        onInstantBookingChange={handleInstantBookingChange}
        onSortChange={handleSortChange}
        onLoadMore={() => fetchNextPage()}
      />

      <HomeFooter />
    </div>
  )
}
