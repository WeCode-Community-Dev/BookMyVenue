import type { VenueResponse } from '../../types'

type Props = {
  venue: VenueResponse
}

export function VenueOverview({ venue }: Props) {
  const coverPhoto =
    venue.photos?.find((photo) => photo.is_cover)?.image_url ?? venue.photos?.[0]?.image_url ?? null

  const venueType = venue.category?.label ?? venue.category?.slug ?? ''
  const bookingTypes = venue.allowed_booking_types
    .map((type) => (type === 'full_day' ? 'Full Day' : 'Time Slot'))
    .join(', ')

  const initials = venue.name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section className="grid gap-6 py-8 lg:grid-cols-[40%_60%]">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-ink-850">
        {coverPhoto ? (
          <img src={coverPhoto} alt={venue.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-light dark:bg-brand/15">
            <span className="text-4xl font-bold text-brand">{initials}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {venue.name}
        </h2>

        <div className="mt-2 flex items-center gap-2 text-base text-zinc-500">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {venue.city}, {venue.state}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {venueType && <Chip>{venueType}</Chip>}
          <Chip>{venue.max_capacity.toLocaleString()} Guests</Chip>
          {bookingTypes && <Chip>{bookingTypes}</Chip>}
          {venue.pricing_mode && <Chip className="capitalize">{venue.pricing_mode.replace('_', ' ')}</Chip>}
        </div>

        {venue.description && (
          <p className="mt-6 text-base leading-7 text-zinc-600 line-clamp-3 dark:text-zinc-400">
            {venue.description}
          </p>
        )}
      </div>
    </section>
  )
}

function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-ink-850 dark:text-zinc-400 ${className}`}
    >
      {children}
    </span>
  )
}