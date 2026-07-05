import { useNavigate } from 'react-router-dom'
import { CATEGORIES, VENUE_TYPE_LABELS } from '../../constants'

const INPUT_BASE =
  'bg-transparent border-0 outline-none ring-0 shadow-none text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none w-full'

type Props = {
  q: string
  city: string
  venueType: string
  capacity: string
  hasFilters: boolean
  onQChange: (v: string) => void
  onCityChange: (v: string) => void
  onCapacityChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCategoryClick: (type: string) => void
  onClearFilters: () => void
}

// ─── Dark category/filter hero ────────────────────────────────────────────────

function FilterHero({
  q,
  venueType,
  city,
  capacity,
  onQChange,
  onCityChange,
  onCapacityChange,
  onSubmit,
}: Pick<
  Props,
  | 'q'
  | 'venueType'
  | 'city'
  | 'capacity'
  | 'onQChange'
  | 'onCityChange'
  | 'onCapacityChange'
  | 'onSubmit'
>) {
  const navigate = useNavigate()
  const typeLabel = venueType ? (VENUE_TYPE_LABELS[venueType] ?? venueType) : ''
  const titleParts = [typeLabel ? `${typeLabel} Venues` : '', city ? `in ${city}` : ''].filter(
    Boolean
  )
  const title = titleParts.length > 0 ? titleParts.join(' ') : 'Venue Search'

  return (
    <section className="bg-gradient-to-br from-[#0b1c19] via-[#0f2920] to-[#163326] py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
          Find the perfect venue to make your event one to remember. Whatever your capacity or
          budget, we're here to help.
        </p>

        {/* Search pill — now 3 fields: Keyword / Area / People */}
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex h-[60px] max-w-3xl items-stretch overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Keyword */}
          <div className="flex flex-1 items-center gap-3 px-5">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                Keyword
              </p>
              <input
                type="text"
                value={q}
                onChange={(e) => onQChange(e.target.value)}
                placeholder="Venue name or type"
                className={INPUT_BASE}
              />
            </div>
          </div>

          <div className="my-3.5 w-px bg-zinc-100" />

          {/* City / Area */}
          <div className="flex flex-1 items-center gap-3 px-5">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Area</p>
              <input
                type="text"
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder="Any area"
                className={INPUT_BASE}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="my-3.5 w-px bg-zinc-100" />

          {/* Capacity */}
          <div className="flex flex-1 items-center gap-3 px-5">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">People</p>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => onCapacityChange(e.target.value)}
                placeholder="Any capacity"
                className={INPUT_BASE}
              />
            </div>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="flex shrink-0 items-center gap-2 bg-brand px-7 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="hidden sm:block">Search {typeLabel || 'venues'}</span>
            <span className="sm:hidden">Search</span>
          </button>
        </form>

        {/* Deep Research link */}
        <p className="mt-4 text-sm text-zinc-500">
          <svg
            className="mr-1.5 inline h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Can't find the right venue?{' '}
          <button
            type="button"
            onClick={() => navigate('/deep-research')}
            className="text-zinc-300 transition-colors hover:text-white"
          >
            Try Deep Research, we'll source options not listed anywhere →
          </button>
        </p>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {[
            { icon: '⭐', text: '4.8 / 5', sub: 'Google' },
            { icon: '🛡️', text: 'Best Price' },
            { icon: '⚡', text: 'Fast quotes' },
          ].map(({ icon, text, sub }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm"
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{text}</span>
              {sub && <span className="text-white/40">{sub}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Landing hero (no filters) ────────────────────────────────────────────────

function HeroFull({
  q,
  city,
  venueType,
  hasFilters,
  onQChange,
  onCityChange,
  onSubmit,
  onCategoryClick,
  onClearFilters,
}: Omit<Props, 'capacity' | 'onCapacityChange'>) {
  return (
    <>
      <section className="bg-white pb-10 pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Venue discovery &amp; booking · India
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]">
            Venue booking, <span className="text-brand">accelerated.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
            Instant availability and transparent pricing from verified venues across India — from
            intimate studios to grand banquet halls.
          </p>

          <form
            onSubmit={onSubmit}
            className="mx-auto mt-9 flex h-14 max-w-2xl items-stretch overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60 transition-shadow focus-within:border-brand/40 focus-within:shadow-brand/10"
          >
            <div className="flex flex-1 items-center gap-3 px-5">
              <svg
                className="h-4 w-4 shrink-0 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={q}
                onChange={(e) => onQChange(e.target.value)}
                placeholder="Venue name, type, or keyword..."
                className={`flex-1 min-w-0 ${INPUT_BASE}`}
              />
            </div>

            <div className="hidden sm:flex items-center gap-2.5 border-l border-zinc-100 px-5">
              <svg
                className="h-3.5 w-3.5 shrink-0 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              <input
                type="text"
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder="City"
                className={`w-28 ${INPUT_BASE}`}
              />
            </div>

            <button
              type="submit"
              className="shrink-0 bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Find venues
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((c) => {
              const active = venueType === c.venue_type
              return (
                <button
                  key={c.venue_type}
                  type="button"
                  onClick={() => onCategoryClick(c.venue_type)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'border-brand bg-brand text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-brand/40 hover:bg-brand/5 hover:text-brand'
                  }`}
                >
                  <span>{c.icon}</span>
                  {c.label}
                </button>
              )
            })}
            {hasFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 transition-colors"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="border-y border-zinc-100 bg-zinc-50/70">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-2.5 px-6 py-3.5">
          {[
            { icon: '★', text: '4.8 average rating' },
            { icon: '✓', text: '500+ verified venues' },
            { icon: '⚡', text: 'Confirmed in 24 hours' },
            { icon: '🛡️', text: 'Secure payments' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <span className="text-brand">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export { FilterHero, HeroFull }

export function HeroSearch(props: Props) {
  if (props.hasFilters) {
    return (
      <FilterHero
        q={props.q}
        venueType={props.venueType}
        city={props.city}
        capacity={props.capacity}
        onQChange={props.onQChange}
        onCityChange={props.onCityChange}
        onCapacityChange={props.onCapacityChange}
        onSubmit={props.onSubmit}
      />
    )
  }
  return <HeroFull {...props} />
}
