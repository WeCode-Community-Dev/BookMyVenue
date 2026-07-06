import { formatPrice, formatDate, formatTime } from '../../utils'
import { QuoteBreakdown } from './QuoteBreakdown'
import type { VenueResponse, PricingQuote, BookingType } from '../../types'

type Props = {
  venue: VenueResponse
  bookingType: BookingType
  showTypeToggle: boolean
  startDate: string | null
  endDate: string | null
  selectedStart: string | null
  selectedEnd: string | null
  quote: PricingQuote | undefined
  quoteLoading: boolean
  quoteError: boolean
  slotError: string | null
  isPending: boolean
  onBookingTypeChange: (type: BookingType) => void
  onReset: () => void
  onBook: () => void
  onEditDates: () => void
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

function DateField({
  label,
  value,
  placeholder,
  onClick,
  borderRight = false,
  isInvalid = false, // default false
}: {
  label: string
  value: string | null
  placeholder: string
  onClick?: () => void
  borderRight?: boolean
  isInvalid?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-0 px-4 py-3 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100
        ${borderRight ? 'border-r border-zinc-200' : ''}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <p
        className={`mt-0.5 text-sm font-semibold truncate ${isInvalid ? 'text-red-600' : value ? 'text-zinc-900' : 'text-zinc-400'}`}
      >
        {value ?? placeholder}
      </p>
    </button>
  )
}

export function VenueReserveCard({
  venue,
  bookingType,
  showTypeToggle,
  startDate,
  endDate,
  selectedStart,
  selectedEnd,
  quote,
  quoteLoading,
  quoteError,
  slotError,
  isPending,
  onBookingTypeChange,
  onReset,
  onBook,
  onEditDates,
}: Props) {
  const isInstantBooking = venue.booking_mode === 'INSTANT'
  const startLabel = startDate ? formatDate(startDate + 'T00:00:00') : null
  const endLabel = endDate ? formatDate(endDate + 'T00:00:00') : null
  const timeLabel =
    selectedStart && selectedEnd
      ? `${formatTime(selectedStart)} – ${formatTime(selectedEnd)}`
      : null

  const advanceLabel = quote ? formatPrice(quote.advance_due_paise) : null
  const totalLabel = quote ? formatPrice(quote.quoted_price_paise) : null

  const hasDate = !!startDate && (bookingType === 'full_day' ? !!endDate : true)
  const hasSlot = bookingType === 'time_slot' ? !!(selectedStart && selectedEnd) : true
  const readyToBook = !!quote && !quoteLoading && !quoteError && hasDate && hasSlot

  // Invalid range check
  const isInvalidRange = !!startDate && !!endDate && startDate > endDate

  const priceDisplay =
    venue.pricing_mode === 'flat' && venue.starting_price_paise != null
      ? { amount: formatPrice(venue.starting_price_paise), unit: 'day' }
      : venue.pricing_mode === 'hourly' && venue.hourly_rate_paise != null
        ? { amount: formatPrice(venue.hourly_rate_paise), unit: 'hr' }
        : null

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg overflow-hidden">
      {/* Price Header */}
      <div className="px-6 pt-6 pb-5 border-b border-zinc-100">
        {totalLabel && !quoteLoading ? (
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-zinc-900 underline underline-offset-2">
                {totalLabel}
              </span>
              <span className="text-sm text-zinc-500">total</span>
            </div>
            {priceDisplay && (
              <p className="mt-0.5 text-xs text-zinc-400">
                {priceDisplay.amount} / {priceDisplay.unit}
              </p>
            )}
          </div>
        ) : priceDisplay ? (
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-900">{priceDisplay.amount}</span>
            <span className="text-sm text-zinc-500">/ {priceDisplay.unit}</span>
          </div>
        ) : (
          <p className="text-base font-semibold text-zinc-500">Price on request</p>
        )}

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="h-3 w-3 text-zinc-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
          </div>
          <span className="text-xs text-zinc-400">New · No reviews yet</span>
        </div>
      </div>

      {/* Booking Type Toggle */}
      {showTypeToggle && (
        <div className="px-6 pt-4">
          <div className="flex overflow-hidden rounded-xl border border-zinc-200">
            <button
              type="button"
              onClick={() => onBookingTypeChange('full_day')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                bookingType === 'full_day'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              Full Day
            </button>
            <button
              type="button"
              onClick={() => onBookingTypeChange('time_slot')}
              className={`flex-1 border-l border-zinc-200 py-2.5 text-sm font-medium transition-colors ${
                bookingType === 'time_slot'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              Time Slot
            </button>
          </div>
        </div>
      )}

      {/* Date / Time Fields */}
      <div className="px-6 py-4">
        <div className="overflow-hidden rounded-xl border border-zinc-300">
          {bookingType === 'full_day' ? (
            <div className="flex divide-x divide-zinc-200">
              <DateField
                label="Check-in"
                value={startLabel}
                placeholder="Add date"
                onClick={onEditDates}
                borderRight
                isInvalid={isInvalidRange}
              />
              <DateField
                label="Check-out"
                value={endLabel}
                placeholder="Add date"
                onClick={onEditDates}
                isInvalid={isInvalidRange}
              />
            </div>
          ) : (
            <div className="flex divide-x divide-zinc-200">
              <DateField
                label="Date"
                value={startLabel}
                placeholder="Add date"
                onClick={onEditDates}
                borderRight
              />

              <DateField
                label="Time"
                value={timeLabel}
                placeholder="Add time"
                onClick={onEditDates}
              />
            </div>
          )}
        </div>

        {(startDate || endDate || selectedStart) && (
          <button
            type="button"
            onClick={onReset}
            className="mt-2 text-xs text-zinc-400 underline hover:text-zinc-600"
          >
            Clear dates
          </button>
        )}
        {/* Guests */}
        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200">
          <div className="flex items-center px-4 py-3">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Guests
              </p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">
                {venue.min_capacity
                  ? `${venue.min_capacity}–${venue.max_capacity}`
                  : `Up to ${venue.max_capacity}`}{' '}
                guests
              </p>
            </div>
            {/* <svg
              className="h-4 w-4 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg> */}
          </div>
        </div>
      </div>

      {/* Quote Breakdown */}
      {(quote || quoteLoading || quoteError) && (
        <div className="px-6 pb-2">
          {quoteLoading && <QuoteBreakdown source="quote" quote={{} as PricingQuote} loading />}
          {quoteError && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              Could not calculate price. Please try again.
            </div>
          )}
          {quote && !quoteLoading && <QuoteBreakdown source="quote" quote={quote} />}
        </div>
      )}

      {/* Errors */}
      {slotError && (
        <div className="mx-6 mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg
            className="h-4 w-4 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {slotError}
        </div>
      )}

      {isInvalidRange && (
        <div className="mx-6 mb-4 text-sm text-red-600">
          Check-out must be after or on check-in date.
        </div>
      )}

      {/* CTA */}
      {/* CTA */}
      <div className="px-6 pb-6">
        {!startDate ? (
          <button
            type="button"
            onClick={onEditDates}
            className="w-full rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.99]"
          >
            Choose a date ↓
          </button>
        ) : (
          <button
            onClick={onBook}
            disabled={!readyToBook || isPending || isInvalidRange}
            className="w-full rounded-xl bg-brand py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-hover active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Checking availability…
              </span>
            ) : bookingType === 'full_day' && !endDate ? (
              'Select end date'
            ) : bookingType === 'time_slot' && !hasSlot ? (
              'Select a time slot'
            ) : quoteLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Calculating…
              </span>
            ) : advanceLabel ? (
              <span className="flex flex-col leading-tight">
                <span>{isInstantBooking ? 'Book Instantly' : 'Request Booking'}</span>
                <span className="text-xs font-normal opacity-80">
                  {isInstantBooking
                    ? `${advanceLabel} advance or pay full next`
                    : `${advanceLabel} advance - no charge yet`}
                </span>
                <span className="hidden">
                  {advanceLabel} advance · no charge yet
                </span>
              </span>
            ) : (
              isInstantBooking ? 'Book Instantly' : 'Request Booking'
            )}
          </button>
        )}

        <p className="mt-3 text-center text-xs text-zinc-400">
          {isInstantBooking
            ? 'Your slot is held briefly while you complete payment'
            : "You won't be charged yet - owner must confirm first"}
        </p>
        <p className="hidden">
          You won't be charged yet · Owner must confirm first
        </p>
      </div>
    </div>
  )
}
