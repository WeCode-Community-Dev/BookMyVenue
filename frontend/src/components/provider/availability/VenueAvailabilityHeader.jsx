import { formatBookingPriceDisplay } from "../../../utils/formatPrice";
import { getVenueCoverUrl } from "../../../utils/venue";

const formatLocation = (venue) => {
  const parts = [venue?.city, venue?.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : venue?.address || "Location not specified";
};

const VenueAvailabilityHeader = ({ venue, slotCount }) => {
  const coverUrl = getVenueCoverUrl(venue);

  return (
    <header className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200/80 sm:h-20 sm:w-20">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-gray-900 sm:text-lg">
            {venue?.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
            {formatLocation(venue)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-red-600">
              {formatBookingPriceDisplay(venue?.price)}
            </span>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${
                venue?.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {venue?.isActive ? "Venue active" : "Venue inactive"}
            </span>
            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 sm:text-xs">
              {slotCount} slot{slotCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VenueAvailabilityHeader;
