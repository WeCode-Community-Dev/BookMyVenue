import { VenueLocationMap } from '@venue404/ui'
import type { VenueResponse } from '../../types'

type Props = { venue: VenueResponse }

export function VenueWhereYoullBe({ venue }: Props) {
  const lat = venue.latitude != null ? parseFloat(venue.latitude) : null
  const lng = venue.longitude != null ? parseFloat(venue.longitude) : null
  const hasCoords = lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Where you'll be</h2>
      <p className="mb-5 text-sm text-zinc-500">
        {/* FIX: don't show the precise street address pre-booking — matches
            the "exact address provided after booking" copy below, which the
            old placeholder contradicted by printing the full address anyway. */}
        {[venue.city, venue.state, venue.country].filter(Boolean).join(', ')}
      </p>

      {hasCoords ? (
        <VenueLocationMap
          latitude={lat!}
          longitude={lng!}
          label={venue.name}
          sublabel={`${venue.city}, ${venue.state}`}
          exact={false}
          height="320px"
        />
      ) : (
        // Fallback placeholder for venues with no coordinates yet
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 sm:h-80 dark:border-ink-700 dark:bg-ink-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-ink-800">
            <svg
              className="h-7 w-7 text-zinc-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-400">Location not pinned yet</p>
        </div>
      )}

      <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
        Located in {venue.city}, {venue.state}.{venue.address_line2 && ` ${venue.address_line2}.`}{' '}
        Exact address provided after booking is confirmed.
      </p>
    </div>
  )
}
