import type { VenueResponse } from '../../types'

type Props = {
  venue: VenueResponse
}

export function VenueSummaryCard({ venue }: Props) {
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
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-ink-800 dark:bg-ink-900">
      <div className="relative h-40 w-full overflow-hidden">
        {coverPhoto ? (
          <>
            <img
              src={coverPhoto || '/placeholder.svg'}
              loading="lazy"
              alt={venue.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-light dark:bg-brand/15">
            <span className="text-4xl font-bold tracking-tight text-brand dark:text-brand-secondary">
              {initials || 'V'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="text-[13px] font-medium text-brand dark:text-brand-secondary">Venue</div>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-balance text-zinc-900 dark:text-zinc-100">
            {venue.name}
          </h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-zinc-500">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="flex flex-wrap gap-2">
          {venueType && <Chip>{venueType}</Chip>}
          <Chip>{venue.max_capacity} guests</Chip>
          {bookingTypes && <Chip>{bookingTypes}</Chip>}
          {venue.pricing_mode && <Chip className="capitalize">{venue.pricing_mode}</Chip>}
        </div>

        {venue.description && (
          <p className="border-t border-zinc-100 pt-4 text-sm leading-relaxed text-zinc-600 dark:border-ink-800 dark:text-zinc-400">
            {venue.description}
          </p>
        )}
      </div>
    </div>
  )
}

type ChipProps = {
  children: React.ReactNode
  className?: string
}

function Chip({ children, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-ink-800 dark:bg-ink-850/60 dark:text-zinc-300 ${className}`}
    >
      {children}
    </span>
  )
}
