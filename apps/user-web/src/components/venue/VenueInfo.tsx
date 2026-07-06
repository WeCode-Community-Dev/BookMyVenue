import { useState } from 'react'
import type { ReactNode } from 'react'
import { formatPrice } from '../../utils'
import type { VenueResponse } from '../../types'

type Props = { venue: VenueResponse }

function formatTimeStr(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

// ─── Highlight row item ───────────────────────────────────────────────────────

function Highlight({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-zinc-100 last:border-0">
      <div className="mt-0.5 shrink-0 text-zinc-500">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        <p className="mt-0.5 text-sm text-zinc-500 leading-snug">{sub}</p>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const CalIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const PeopleIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const MoneyIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

// ─── Component ────────────────────────────────────────────────────────────────

const DESC_LIMIT = 320

export function VenueInfo({ venue }: Props) {
  const [descExpanded, setDescExpanded] = useState(false)
  const typeLabel = venue.category?.label ?? venue.category?.slug ?? ''
  const isInstantBooking = venue.booking_mode === 'INSTANT'

  const bookingTypeLabel =
    venue.allowed_booking_types.includes('full_day') && venue.allowed_booking_types.includes('time_slot')
      ? 'Full day & time slot bookings'
      : venue.allowed_booking_types.includes('full_day')
      ? 'Full day bookings only'
      : 'Hourly time slot bookings'

  const bookingTypeSub =
    venue.allowed_booking_types.includes('full_day') && venue.allowed_booking_types.includes('time_slot')
      ? 'Book the whole day or pick specific hours'
      : venue.allowed_booking_types.includes('full_day')
      ? `Full day from ${formatTimeStr(venue.open_time)} to ${formatTimeStr(venue.close_time)}`
      : `Min ${venue.min_booking_duration_minutes / 60}h · pick your start time`

  const openLabel = venue.spans_next_day
    ? `${formatTimeStr(venue.open_time)} – ${formatTimeStr(venue.close_time)} (next day)`
    : `${formatTimeStr(venue.open_time)} – ${formatTimeStr(venue.close_time)}`

  const capacityLabel =
    venue.min_capacity
      ? `${venue.min_capacity}–${venue.max_capacity} guests`
      : `Up to ${venue.max_capacity} guests`

  const pricingLabel =
    venue.pricing_mode === 'flat' && venue.starting_price_paise
      ? `From ${formatPrice(venue.starting_price_paise)} per day`
      : venue.pricing_mode === 'hourly' && venue.hourly_rate_paise
      ? `From ${formatPrice(venue.hourly_rate_paise)} per hour`
      : venue.pricing_mode === 'mixed'
      ? 'Flat & hourly pricing available'
      : 'Pricing on request'

  const pricingSub = `${Number(venue.advance_pct)}% advance due within 24h of acceptance`

  const desc    = venue.description ?? ''
  const isLong  = desc.length > DESC_LIMIT
  const preview = isLong && !descExpanded ? desc.slice(0, DESC_LIMIT).trimEnd() + '…' : desc

  return (
    <div>
      {/* ── Title ────────────────────────────────────────────── */}
      <h1 className="text-[28px] font-semibold tracking-tight text-zinc-900 sm:text-[32px] leading-snug">
        {venue.name}
      </h1>

      {/* ── Subtitle row ─────────────────────────────────────── */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {venue.city}, {venue.state}
        </span>
        <span className="text-zinc-300">·</span>
        <span>{capacityLabel}</span>
        <span className="text-zinc-300">·</span>
        <span className="inline-flex items-center rounded-full border border-brand-muted bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand">
          {typeLabel}
        </span>
        {isInstantBooking && (
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            Instant Booking
          </span>
        )}
      </div>

      {/* ── Reviews row (placeholder) ─────────────────────── */}
      <div className="mt-3 flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-zinc-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ))}
        </div>
        <span className="text-zinc-400 text-xs">New venue · No reviews yet</span>
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="my-6 border-t border-zinc-100" />

      {/* ── Hosted by ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-white text-sm font-bold shadow-sm">
            {getInitials(venue.name)}
          </div>
          <div>
            <p className="text-base font-semibold text-zinc-900">Hosted by {venue.name}</p>
            <p className="text-xs text-zinc-500">
              Member since {new Date(venue.created_at).getFullYear()}
              {' · '}Responds within {venue.owner_action_window_hours}h
            </p>
          </div>
        </div>
        {/* Verified badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600">
          <svg className="h-3.5 w-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Verified venue
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="my-6 border-t border-zinc-100" />

      {/* ── Highlights ───────────────────────────────────────── */}
      <div>
        {isInstantBooking && (
          <Highlight
            icon={<ClockIcon />}
            title="Instant Confirmation"
            sub="No owner approval required after payment is completed"
          />
        )}
        <Highlight icon={<CalIcon />}  title={bookingTypeLabel} sub={bookingTypeSub} />
        <Highlight icon={<ClockIcon />} title="Operating hours" sub={openLabel} />
        <Highlight icon={<PeopleIcon />} title={capacityLabel} sub={venue.min_capacity ? `Minimum ${venue.min_capacity} · maximum ${venue.max_capacity}` : `Maximum capacity ${venue.max_capacity} people`} />
        <Highlight icon={<MoneyIcon />} title={pricingLabel} sub={pricingSub} />
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="my-6 border-t border-zinc-100" />

      {/* ── About this place ─────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">About this place</h2>
        {desc ? (
          <>
            <p className="text-base leading-relaxed text-zinc-600 whitespace-pre-line">{preview}</p>
            {isLong && (
              <button
                onClick={() => setDescExpanded(v => !v)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 underline underline-offset-2 hover:text-brand"
              >
                {descExpanded ? 'Show less' : 'Show more'}
                <svg className={`h-3.5 w-3.5 transition-transform ${descExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <svg className="h-5 w-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">The venue owner hasn't added a description yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
