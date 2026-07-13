import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'
import { useLikes } from '../lib/useLikes'
import { useAuth } from '../lib/AuthContext'
import { useAuthModal } from '../lib/AuthModalContext'
import { useEligibleBookings } from '../hooks/useReviews'
import { toUtcIso } from '../utils'

import { AppNavbar } from '../components/shared/AppNavbar'
import { VenueGallery } from '../components/venue/VenueGallery'
import { VenueInfo } from '../components/venue/VenueInfo'
import { AmenitiesList } from '../components/venue/AmenitiesList'
import { VenueAvailabilitySection } from '../components/venue/VenueAvailabilitySection'
import { VenueReserveCard } from '../components/venue/VenueReserveCard'
import { VenueReviews } from '../components/venue/VenueReviews'
import { VenueWhereYoullBe } from '../components/venue/VenueWhereYoullBe'
import { VenueMeetHost } from '../components/venue/VenueMeetHost'
import { VenueThingsToKnow } from '../components/venue/VenueThingsToKnow'

import type { VenueResponse, AvailabilityResponse, PricingQuote, BookingType } from '../types'

function Divider() {
  return <div className="my-10 border-t border-zinc-100 dark:border-ink-800" />
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function VenueDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-[500px] w-full rounded-2xl bg-zinc-100 dark:bg-ink-800" />
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="flex-1 space-y-6">
          <div className="h-9 w-2/3 rounded-xl bg-zinc-100 dark:bg-ink-800" />
          <div className="h-4 w-1/3 rounded bg-zinc-100 dark:bg-ink-800" />
          <div className="h-px w-full bg-zinc-100 dark:bg-ink-800" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-4 border-b border-zinc-50 dark:border-ink-800"
            >
              <div className="h-6 w-6 rounded bg-zinc-100 dark:bg-ink-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-2/3 rounded bg-zinc-100 dark:bg-ink-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-ink-800" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="h-[480px] rounded-2xl bg-zinc-100 dark:bg-ink-800" />
        </div>
      </div>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function VenueNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-ink-800">
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Venue not found</h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        This venue may have been removed or is not yet published.
      </p>
      <button
        onClick={onBack}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Browse venues
      </button>
    </div>
  )
}

// ─── Booking state hook ───────────────────────────────────────────────────────

function useVenueBooking(venue: VenueResponse) {
  const navigate = useNavigate()
  const client = createClient()
  const { user } = useAuth()
  const { openLogin } = useAuthModal()

  const isTimeSlotVenue = venue.allowed_booking_types.includes('time_slot')
  const isFullDayVenue = venue.allowed_booking_types.includes('full_day')
  const showTypeToggle = isTimeSlotVenue && isFullDayVenue

  const [bookingType, setBookingType] = useState<BookingType>(
    isTimeSlotVenue && !isFullDayVenue ? 'time_slot' : 'full_day'
  )
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [selectedStart, setSelectedStart] = useState<string | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null)
  const [slotError, setSlotError] = useState<string | null>(null)

  // Auto-set booking type
  useEffect(() => {
    if (isTimeSlotVenue && !isFullDayVenue) setBookingType('time_slot')
    else if (isFullDayVenue && !isTimeSlotVenue) setBookingType('full_day')
  }, [isTimeSlotVenue, isFullDayVenue])

  // Full-day: compute operating window datetimes (supports same-day & multi-day)
  useEffect(() => {
    if (bookingType === 'full_day' && startDate && endDate) {
      const openH = venue.open_time.slice(0, 5)
      const closeH = venue.close_time.slice(0, 5)

      const computedStart = `${startDate}T${openH}:00`
      const computedEnd = `${endDate}T${closeH}:00`

      setSelectedStart(computedStart)
      setSelectedEnd(computedEnd)
    } else if (bookingType === 'full_day' && startDate) {
      const openH = venue.open_time.slice(0, 5)
      const closeH = venue.close_time.slice(0, 5)
      setSelectedStart(`${startDate}T${openH}:00`)
      setSelectedEnd(`${startDate}T${closeH}:00`)
    } else if (bookingType === 'time_slot' && startDate) {
      setSelectedStart(null)
      setSelectedEnd(null)
    } else {
      setSelectedStart(null)
      setSelectedEnd(null)
    }
  }, [bookingType, startDate, endDate, venue.open_time, venue.close_time])

  const availQuery = useQuery<AvailabilityResponse>({
    queryKey: ['availability-date', venue.id, startDate, bookingType],
    queryFn: () =>
      venueEndpoints(client).getDateAvailability(venue.id, {
        booking_date: toUtcIso(startDate)!,
        booking_type: bookingType,
      }),
    enabled: bookingType === 'time_slot' && !!startDate,
    staleTime: 2 * 60 * 1000,
  })

  const quoteEnabled = !!selectedStart && !!selectedEnd && selectedStart !== selectedEnd

  const quoteQuery = useQuery<PricingQuote>({
    queryKey: ['quote', venue.id, selectedStart, selectedEnd, bookingType],
    queryFn: () =>
      venueEndpoints(client).getQuote(venue.id, {
        starts_at: toUtcIso(selectedStart)!,
        ends_at: toUtcIso(selectedEnd)!,
        booking_type: bookingType,
      }),
    enabled: quoteEnabled,
    staleTime: 60 * 1000,
  })

  const validateMutation = useMutation({
    mutationFn: () =>
      venueEndpoints(client).validateSlot(venue.id, {
        booking_type: bookingType,
        starts_at: toUtcIso(selectedStart),
        ends_at: toUtcIso(selectedEnd),
        booking_date: bookingType === 'full_day' ? toUtcIso(startDate) : undefined,
      }),
    onSuccess: (validation) => {
      if (!validation.valid) {
        setSlotError('This slot is no longer available.')
        return
      }

      navigate('/checkout', {
        state: {
          venueId: venue.id,
          venueName: venue.name,
          venueCoverImage: venue.photos?.find((p) => p.is_cover)?.image_url ?? null,
          bookingType,
          bookingMode: venue.booking_mode ?? 'MANUAL',

          userStartsAt: toUtcIso(selectedStart),
          userEndsAt: toUtcIso(selectedEnd),

          startsAt: validation.effective_starts_at,
          endsAt: validation.effective_ends_at,

          bookingDate: toUtcIso(startDate),
          quote: quoteQuery.data,
        },
      })
    },
    onError: (err: unknown) => {
      console.error('Validation error:', err)
      setSlotError(err instanceof Error ? err.message : 'Unable to book.')
    },
  })

  const handleBookingTypeChange = (next: BookingType) => {
    if (next === bookingType) return
    setBookingType(next)
    setStartDate(null)
    setEndDate(null)
    setSelectedStart(null)
    setSelectedEnd(null)
    setSlotError(null)
  }

  const handleRangeChange = (start: string | null, end: string | null) => {
    let finalStart = start
    let finalEnd = end

    if (finalStart && finalEnd && finalStart > finalEnd) {
      ;[finalStart, finalEnd] = [finalEnd, finalStart]
    }

    setStartDate(finalStart)
    setEndDate(finalEnd)
    setSlotError(null)
  }

  const handleSlotSelect = (start: string, end: string | null) => {
    setSelectedStart(start)
    setSelectedEnd(end)
    setSlotError(null)
  }

  const resetAll = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectedStart(null)
    setSelectedEnd(null)
    setSlotError(null)
  }

  const resetSlot = () => {
    setSelectedStart(null)
    setSelectedEnd(null)
    setSlotError(null)
  }

  const handleBook = () => {
    if (!user) {
      openLogin()
      return
    }
    setSlotError(null)
    validateMutation.mutate()
  }

  return {
    bookingType,
    showTypeToggle,
    startDate,
    endDate,
    selectedStart,
    selectedEnd,
    slotError,
    availability: availQuery.data,
    availLoading: availQuery.isLoading,
    availError: availQuery.isError,
    quote: quoteQuery.data,
    quoteLoading: quoteQuery.isLoading,
    quoteError: quoteQuery.isError,
    isPending: validateMutation.isPending,
    handleBookingTypeChange,
    handleRangeChange,
    handleSlotSelect,
    resetAll,
    resetSlot,
    handleBook,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const client = createClient()

  const {
    data: venue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => venueEndpoints(client).getVenue(id!),
    enabled: !!id,
  })

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors dark:hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to results
          </button>

          {venue && <VenueActions venueId={venue.id} venueName={venue.name} />}
        </div>

        {isLoading && <VenueDetailSkeleton />}
        {(isError || (!isLoading && !venue)) && <VenueNotFound onBack={() => navigate('/')} />}
        {venue && <VenueContent venue={venue} />}
      </main>
    </div>
  )
}

// ─── Venue Actions ────────────────────────────────────────────────────────────

function VenueActions({ venueId, venueName }: { venueId: string; venueName: string }) {
  const { isLiked, toggleLike } = useLikes()
  const { user } = useAuth()
  const { openLogin } = useAuthModal()
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'copied' | 'failed'>('idle')

  const liked = isLiked(venueId)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = venueName ? `${venueName} on Venue404` : 'Check out this venue on Venue404'

  useEffect(() => {
    if (shareState === 'idle') return

    const timeout = window.setTimeout(() => setShareState('idle'), 1600)
    return () => window.clearTimeout(timeout)
  }, [shareState])

  const handleLike = () => {
    if (!user) {
      openLogin()
      return
    }
    toggleLike(venueId)
  }

  const handleShare = async () => {
    if (!shareUrl) return

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: `Check out ${shareTitle}`,
          url: shareUrl,
        })
        setShareState('shared')
        return
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setShareState('copied')
        return
      }

      window.prompt('Copy this link:', shareUrl)
      setShareState('failed')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl)
          setShareState('copied')
        }
      } catch {
        setShareState('failed')
      }
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setShareState('copied')
      } else {
        window.prompt('Copy this link:', shareUrl)
        setShareState('failed')
      }
    } catch {
      setShareState('failed')
    }
  }

  const shareLabel =
    shareState === 'shared'
      ? 'Shared'
      : shareState === 'copied'
        ? 'Copied'
        : shareState === 'failed'
          ? 'Copy manually'
          : 'Share'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors underline-offset-2 hover:underline dark:hover:text-zinc-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {shareLabel}
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors underline-offset-2 hover:underline dark:hover:text-zinc-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16h8M8 12h8m-8-4h5"
          />
        </svg>
        Copy link
      </button>
      <button
        type="button"
        onClick={handleLike}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors underline-offset-2 hover:underline dark:hover:text-zinc-100"
      >
        <svg
          className={`h-4 w-4 transition-colors ${liked ? 'text-red-500' : ''}`}
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={liked ? 1 : 2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {liked ? 'Saved' : 'Save'}
      </button>
    </div>
  )
}

// ─── Content (hooks run after venue is available) ─────────────────────────────

function VenueContent({ venue }: { venue: VenueResponse }) {
  const b = useVenueBooking(venue)
  const { eligibleBookingIds } = useEligibleBookings(venue.id)
  const isInstantBooking = venue.booking_mode === 'INSTANT'

  const [, setScrollTrigger] = useState(0)

  function scrollToAvailability() {
    setScrollTrigger((n) => n + 1)
    document
      .getElementById('availability-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Gallery */}
      <VenueGallery photos={venue.photos ?? []} venueName={venue.name} />

      {/* ── Two-column body
          KEY: NO `items-start` here. Default flex is `items-stretch`, which
          makes the right column div as tall as the left column. That lets
          the inner `sticky` element scroll through the whole page. ── */}
      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-16 xl:gap-20">
        {/* ════ LEFT ══════════════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          <VenueInfo venue={venue} />
          <Divider />

          <AmenitiesList amenities={venue.amenities ?? []} />
          <Divider />

          {/* Two-month date range calendar */}
          <div id="availability-section">
            <VenueAvailabilitySection
              venue={venue}
              bookingType={b.bookingType}
              startDate={b.startDate}
              endDate={b.endDate}
              selectedStart={b.selectedStart}
              selectedEnd={b.selectedEnd}
              availability={b.availability}
              availLoading={b.availLoading}
              availError={b.availError}
              onRangeChange={b.handleRangeChange}
              onSlotSelect={b.handleSlotSelect}
              onClear={b.resetAll}
              onClearSlot={b.resetSlot}
            />
          </div>
          <Divider />

          <VenueReviews venueId={venue.id} userEligibleBookingIds={eligibleBookingIds} />
          <Divider />

          <VenueWhereYoullBe venue={venue} />
          <Divider />

          <VenueMeetHost venue={venue} />
          <Divider />

          <VenueThingsToKnow venue={venue} />

          {/* Mobile padding so card doesn't overlap */}
          <div className="h-36 lg:hidden" />
        </div>

        {/* ════ RIGHT — sticky card ═══════════════════════════ */}
        {/* self-stretch (default) makes this div as tall as the left column
            so the inner sticky element can scroll through the whole page. */}
        <div className="w-full lg:w-[400px] xl:w-[420px] shrink-0">
          <div className="lg:sticky lg:top-[82px]">
            <VenueReserveCard
              venue={venue}
              bookingType={b.bookingType}
              showTypeToggle={b.showTypeToggle}
              startDate={b.startDate}
              endDate={b.endDate}
              selectedStart={b.selectedStart}
              selectedEnd={b.selectedEnd}
              quote={b.quote}
              quoteLoading={b.quoteLoading}
              quoteError={b.quoteError}
              slotError={b.slotError}
              isPending={b.isPending}
              onBookingTypeChange={(type) => {
                b.handleBookingTypeChange(type)
                scrollToAvailability() // FIX: jump to calendar the moment type changes
              }}
              onReset={b.resetAll}
              onBook={b.handleBook}
              onEditDates={scrollToAvailability} // FIX: from the earlier date-field fix
            />

            {/* Trust micro-copy */}
            <div className="mt-4 space-y-2.5 px-1">
              {[
                isInstantBooking
                  ? 'Instant confirmation after payment'
                  : 'No charge until the owner accepts',
                'Verified venue on Venue404',
                'Cancellation terms per policy below',
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <span className="font-semibold text-brand dark:text-brand-secondary">OK</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="hidden">
              {[
                { icon: '🛡️', text: 'No charge until the owner accepts' },
                { icon: '✓', text: 'Verified venue on Venue404' },
                { icon: '↩', text: 'Cancellation terms per policy below' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
