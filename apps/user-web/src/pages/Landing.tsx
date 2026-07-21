import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'

import { HomeNavbar } from '../components/home/HomeNavbar'
import { HeroFull } from '../components/home/HeroSearch'
import { CategorySection } from '../components/home/CategorySection'
import { TrendingVenuesSection } from '../components/home/TrendingVenuesSection'
import { TrustStrip } from '../components/home/TrustStrip'
import { HomeFooter } from '../components/home/HomeFooter'
import {
  ProgrammeMetrics,
  WhyVenue404,
  DeepResearchSection,
  IntelligentPlatform,
} from '../components/home/HomeLandingSections'

export default function Landing() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['venues', 'trending'],
    queryFn: () => venueEndpoints(createClient()).hybrid_search({ page: 1, page_size: 8 }),
    staleTime: 5 * 60 * 1000,
  })
  const trendingVenues = trendingData?.items ?? []

  // Only q + city are ever sent — venue_type/capacity simply aren't
  // tracked on this page, so there's nothing stale to carry forward.
  function buildSearchUrl(
    overrides: Partial<{ q: string; city: string; venue_type: string }> = {}
  ) {
    const next: Record<string, string> = {}
    const mq = overrides.q ?? q
    const mcity = overrides.city ?? city
    if (mq) next.q = mq
    if (mcity) next.city = mcity
    if (overrides.venue_type) next.venue_type = overrides.venue_type
    return `/venues?${new URLSearchParams(next).toString()}`
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(buildSearchUrl())
  }

  function handleCategoryClick(type: string) {
    // category click is a *fresh* search intent — explicitly only
    // carries the venue_type, not whatever's sitting in q/city
    navigate(`/venues?venue_type=${encodeURIComponent(type)}`)
  }

  function handleViewAll() {
    navigate('/venues')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <HomeNavbar />

      <HeroFull
        q={q}
        city={city}
        venueType=""
        hasFilters={false}
        onQChange={setQ}
        onCityChange={setCity}
        onSubmit={handleSearchSubmit}
        onCategoryClick={handleCategoryClick}
        onClearFilters={() => {
          setQ('')
          setCity('')
        }}
      />

      <CategorySection onCategoryClick={handleCategoryClick} />
      <ProgrammeMetrics />
      <WhyVenue404 />
      <TrendingVenuesSection
        venues={trendingVenues}
        loading={trendingLoading}
        onVenueClick={(id) => navigate(`/venues/${id}`)}
        onViewAll={handleViewAll}
      />
      <DeepResearchSection />
      <IntelligentPlatform />
      <TrustStrip />
      <HomeFooter />
    </div>
  )
}
