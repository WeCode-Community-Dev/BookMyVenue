import type { VenueResponse } from '../../types'

type Props = {
  venue: VenueResponse
}

export function VenueSummaryCard({ venue }: Props) {
  const coverPhoto =
    venue.photos?.find((photo) => photo.is_cover)?.image_url ?? venue.photos?.[0]?.image_url ?? null

  const venueType = venue.category?.label ?? venue.category?.slug ?? ''

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
      {coverPhoto ? (
        <img src={coverPhoto} alt={venue.name} loading="lazy" className="h-56 w-full object-cover" />
      ) : (
        <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-ink-800 dark:to-ink-900">
          <svg
            className="h-9 w-9 text-zinc-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7l4-4h10l4 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
            />
          </svg>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Venue
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{venue.name}</h2>

            <div className="mt-2 flex items-center gap-2 text-zinc-500">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm">
                {venue.city}, {venue.state}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <InfoCard label="Venue Type" value={venueType} />
            <InfoCard label="Capacity" value={String(venue.max_capacity)} />
            <InfoCard
              label="Booking Type"
              value={venue.allowed_booking_types
                .map((type) => (type === 'full_day' ? 'Full Day' : 'Time Slot'))
                .join(', ')}
            />
            <InfoCard label="Pricing" value={venue.pricing_mode} />
          </div>

          {venue.description && (
            <div className="border-t border-zinc-100 pt-5 dark:border-ink-800">
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{venue.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type InfoCardProps = {
  label: string
  value: string
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-zinc-100 p-4 dark:border-ink-800">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</div>
    </div>
  )
}
