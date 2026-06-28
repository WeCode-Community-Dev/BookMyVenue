import { MapPin } from "lucide-react";
import {
  formatSlotLabel,
  formatTimeRange,
} from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { resolvePopulatedRef } from "../../utils/booking";
import { getBookingDisplayStatus } from "../../utils/bookingFilters";
import { getVenueCoverUrl } from "../../utils/venue";

const statusToneStyles = {
  upcoming: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  completed: "bg-sky-50 text-sky-700 ring-sky-100",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
};

const formatCompactDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const BookingCard = ({ booking }) => {
  const venue = resolvePopulatedRef(booking?.venueId);
  const slot = resolvePopulatedRef(booking?.availabilityId);
  const { amount } = formatPrice(booking?.amount);
  const displayStatus = getBookingDisplayStatus(booking);

  const slotDate = slot?.date ? formatCompactDate(slot.date) : "—";
  const slotTime = slot
    ? formatTimeRange(slot.startTime, slot.endTime)
    : "—";
  const slotLabel = slot?.slotLabel ? formatSlotLabel(slot.slotLabel) : null;
  const coverUrl = getVenueCoverUrl(venue);
  const location =
    venue?.city || venue?.state
      ? [venue.city, venue.state].filter(Boolean).join(", ")
      : venue?.address || "Location unavailable";

  return (
    <article className="group rounded-xl border border-gray-200/80 bg-white p-3 ring-1 ring-gray-100/80 transition-all duration-200 hover:border-gray-300 hover:shadow-md sm:p-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-[4.5rem] sm:w-[4.5rem]">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 text-xs font-medium text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-gray-900 sm:text-[15px]">
              {venue?.title || "Venue unavailable"}
            </h2>

            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500 sm:text-sm">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-red-500" aria-hidden="true" />
              {location}
            </p>

            <p className="mt-1.5 text-xs text-gray-600 sm:hidden">
              {slotDate}
              {slotLabel ? ` · ${slotLabel}` : ""}
              {slotTime !== "—" ? ` · ${slotTime}` : ""}
            </p>

            <p className="mt-1.5 truncate font-mono text-[11px] text-gray-400 sm:hidden">
              Ref: {booking.bookingReference || "—"}
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-[1.1] sm:block">
          <p className="text-sm font-medium text-gray-900">{slotDate}</p>
          {slotLabel && (
            <p className="mt-0.5 text-xs font-medium text-gray-600">{slotLabel}</p>
          )}
          <p className="mt-0.5 text-xs text-gray-500">{slotTime}</p>
        </div>

        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Reference
          </p>
          <p className="mt-0.5 truncate font-mono text-xs text-gray-700">
            {booking.bookingReference || "—"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:w-auto sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
              statusToneStyles[displayStatus.tone]
            }`}
          >
            {displayStatus.label}
          </span>

          <p className="text-lg font-bold text-red-600 sm:text-base">{amount}</p>
        </div>
      </div>
    </article>
  );
};

export default BookingCard;
