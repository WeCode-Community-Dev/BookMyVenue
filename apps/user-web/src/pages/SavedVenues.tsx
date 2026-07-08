import { useQuery } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'
import { Link, useNavigate } from 'react-router-dom'
import { AppNavbar } from '../components/shared/AppNavbar'
import { VenueCard } from '../components/home/VenueCard'
import { useLikes } from '../lib/useLikes'

export default function SavedVenues() {
  const navigate = useNavigate()
  const client = createClient()
  const { likedVenueIds } = useLikes()

  // Fetch venue details for all liked venues
  const { data: venues, isLoading } = useQuery({
    queryKey: ['saved-venues', likedVenueIds],
    queryFn: async () => {
      const endpoints = venueEndpoints(client)
      const promises = likedVenueIds.map(id => endpoints.getVenue(id))
      const results = await Promise.all(promises)
      return results.map(venue => {
        const coverPhoto = venue.photos?.find(p => p.is_cover) || venue.photos?.[0]
        return {
          ...venue,
          cover_photo_url: coverPhoto?.image_url || null
        }
      })
    },
    enabled: likedVenueIds.length > 0,
  })

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
          Saved Venues
        </h1>
        
        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] animate-pulse dark:bg-ink-900">
                <div className="aspect-[4/3] bg-zinc-100 dark:bg-ink-800" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-ink-800" />
                  <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-ink-800" />
                  <div className="h-3 w-2/5 rounded bg-zinc-100 dark:bg-ink-800" />
                  <div className="h-3 w-full rounded bg-zinc-100 dark:bg-ink-800" />
                  <div className="h-3 w-4/5 rounded bg-zinc-100 dark:bg-ink-800" />
                </div>
              </div>
            ))}
          </div>
        ) : !venues || venues.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 dark:bg-ink-800">
              <svg className="h-8 w-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">No saved venues yet</h2>
            <p className="mt-2 text-zinc-500 max-w-sm">
              As you search, click the heart icon to save your favorite venues here.
            </p>
            <Link
              to="/venues"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-6 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {venues.map((venue) => (
              <VenueCard 
                key={venue.id} 
                // We cast Venue to SearchResult here as VenueCard expects SearchResult, 
                // but Venue has all the required fields.
                venue={venue as any} 
                onClick={() => navigate(`/venues/${venue.id}`)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
