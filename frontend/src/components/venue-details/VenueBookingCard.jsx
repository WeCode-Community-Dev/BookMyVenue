import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import { formatBookingPriceDisplay, formatPrice } from "../../utils/formatPrice";
import { formatSlotDate, formatTimeRange } from "../../utils/formatDate";
import { getDisplayLabelForSlot } from "../../utils/predefinedSlots";
import {
  getVenueGoogleMapsUrl,
  hasVenueLocationData,
} from "../../utils/venueLocation";

const VenueBookingCard = ({
  venue,
  selectedSlot,
  bookableSlotCount,
  isAuthenticated,
  loginPath,
  canBook,
  isPaying,
  onBookNow,
  onViewAvailability,
  className = "",
}) => {
  const priceLabel = formatBookingPriceDisplay(venue?.price);

  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white p-4 shadow-md shadow-gray-200/30 ring-1 ring-gray-100/80 sm:p-5 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-2xl font-bold text-gray-900">{priceLabel}</p>
        <span className="text-xs font-medium text-gray-500">
          {bookableSlotCount} slot{bookableSlotCount === 1 ? "" : "s"} open
        </span>
      </div>

      {selectedSlot ? (
        <div className="mt-4 rounded-xl bg-red-50/80 px-3 py-3 text-sm ring-1 ring-red-100">
          <p className="font-medium text-gray-900">Selected slot</p>
          <p className="mt-1 text-gray-700">{formatSlotDate(selectedSlot.date)}</p>
          <p className="mt-0.5 font-medium text-gray-900">
            {getDisplayLabelForSlot(selectedSlot)}
          </p>
          <p className="mt-0.5 text-gray-600">
            {formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">
          Select a slot below to continue booking.
        </p>
      )}

      <button
        type="button"
        onClick={onBookNow}
        disabled={!canBook || isPaying}
        className="mt-4 flex w-full min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPaying ? "Processing..." : "Book Now"}
      </button>

      {onViewAvailability && (
        <button
          type="button"
          onClick={onViewAvailability}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-200 hover:text-red-600"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          View availability
        </button>
      )}

      {!isAuthenticated && (
        <p className="mt-3 text-center text-sm text-gray-500">
          <Link
            to="/login"
            state={{ from: loginPath }}
            className="font-medium text-red-600 hover:text-red-700 hover:underline"
          >
            Sign in
          </Link>{" "}
          to book
        </p>
      )}
    </div>
  );
};

export const BookingSuccessCard = ({
  booking,
  venue,
  venueTitle,
  selectedSlot,
  onViewBookings,
  onBookAnother,
}) => {
  const { amount } = formatPrice(booking?.amount ?? selectedSlot?.price);
  const slotLabel = selectedSlot
    ? getDisplayLabelForSlot(selectedSlot)
    : "—";
  const slotDate = selectedSlot?.date
    ? formatSlotDate(selectedSlot.date)
    : "—";
  const timeRange = selectedSlot
    ? formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)
    : "—";
  const venueMapsUrl = venue && hasVenueLocationData(venue)
    ? getVenueGoogleMapsUrl(venue)
    : null;

  return (
    <div
      role="status"
      className="rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2
          className="mt-0.5 h-6 w-6 shrink-0 text-green-700"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-green-900">
            Booking confirmed
          </h3>
          <dl className="mt-3 space-y-2 text-sm text-green-900/90">
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <dt className="text-green-800/80">Reference</dt>
              <dd className="font-semibold">{booking?.bookingReference || "—"}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <dt className="text-green-800/80">Venue</dt>
              <dd className="font-medium">{venueTitle || "—"}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <dt className="text-green-800/80">Date</dt>
              <dd>{slotDate}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <dt className="text-green-800/80">Slot</dt>
              <dd>
                {slotLabel}
                {timeRange !== "—" && (
                  <span className="block text-xs text-green-800/70">{timeRange}</span>
                )}
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <dt className="text-green-800/80">Amount</dt>
              <dd className="font-semibold">{amount}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {onBookAnother && (
              <button
                type="button"
                onClick={onBookAnother}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
              >
                Book another slot
              </button>
            )}
            {venueMapsUrl && (
              <a
                href={venueMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-4 py-2.5 text-sm font-semibold text-green-800 transition-colors hover:bg-green-100/50 sm:w-auto"
              >
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                View Venue Location
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
              </a>
            )}
            <button
              type="button"
              onClick={onViewBookings}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-green-700 bg-white px-4 py-2.5 text-sm font-semibold text-green-800 transition-colors hover:bg-green-100/50 sm:w-auto"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueBookingCard;
