import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'

import { HomeNavbar } from '../components/home/HomeNavbar'
import { FilterHero } from '../components/home/HeroSearch'
import { VenueGrid } from '../components/home/VenueGrid'
import { HomeFooter } from '../components/home/HomeFooter'

async function searchVenues(params: URLSearchParams) {
  const client = createClient()
  const query: Record<string, string> = { page: '1', page_size: '100' }
  if (params.get('q')) query.q = params.get('q')!
  if (params.get('city')) query.city = params.get('city')!
  if (params.get('venue_type')) query.venue_type = params.get('venue_type')!
  if (params.get('capacity')) query.capacity = params.get('capacity')!
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

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['venues', 'search', searchParams.toString()],
    queryFn: () => searchVenues(searchParams),
  })

  const venues = data?.items ?? []
  const total = data?.total ?? null

  function buildParams(
    overrides: Partial<{ q: string; city: string; venue_type: string; capacity: string }> = {}
  ) {
    const merged = {
      q: overrides.q ?? q,
      city: overrides.city ?? city,
      venue_type: overrides.venue_type ?? venueType,
      capacity: overrides.capacity ?? capacity,
    }
    const next: Record<string, string> = {}
    if (merged.q) next.q = merged.q
    if (merged.city) next.city = merged.city
    if (merged.venue_type) next.venue_type = merged.venue_type
    if (merged.capacity) next.capacity = merged.capacity
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

  function handleClearFilters() {
    setQ('')
    setCity('')
    setCapacity('')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />

      <FilterHero
        q={q}
        venueType={venueType}
        city={city}
        capacity={capacity}
        onQChange={setQ}
        onCityChange={setCity}
        onCapacityChange={handleCapacityChange}
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
        onVenueClick={(id) => navigate(`/venues/${id}`)}
        onRetry={refetch}
        onClearFilters={handleClearFilters}
        onVenueTypeChange={handleVenueTypeChange}
        onCapacityChange={handleCapacityChange}
      />

      <HomeFooter />
    </div>
  )
}
