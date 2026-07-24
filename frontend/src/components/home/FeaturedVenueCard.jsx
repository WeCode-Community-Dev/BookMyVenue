import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import { getVenueCoverUrl } from "../../utils/venue";
import { getCategoryLabel } from "../../utils/venueFilters";
import { formatBookingPriceDisplay } from "../../utils/formatPrice";

const formatVenueLocation = (venue) => {
  const parts = [venue.city, venue.state].filter(Boolean);

  if (parts.length > 0) {
    return `${parts.join(", ")}, India`;
  }

  return venue.address || "Location not specified";
};

const FeaturedVenueCard = ({ venue }) => {
  const coverUrl = getVenueCoverUrl(venue);
  const priceLabel = formatBookingPriceDisplay(venue?.price);

  return (
    <Link
      to={`/venues/${venue._id}`}
      className="group relative block aspect-square overflow-hidden rounded-lg border border-gray-200/70 bg-gray-100 shadow-sm ring-1 ring-gray-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-100/80 hover:shadow-md hover:shadow-red-600/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={venue.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
          No image
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
        aria-hidden="true"
      />

      {venue.category && (
        <span className="absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-md bg-white/92 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-700 backdrop-blur-sm sm:text-xs">
          {getCategoryLabel(venue.category)}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-3.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white sm:text-[15px]">
          {venue.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-white/85 sm:text-xs">
          <MapPin
            className="mr-0.5 inline h-3.5 w-3.5 -translate-y-px text-white/70"
            aria-hidden="true"
          />
          {formatVenueLocation(venue)}
        </p>

        <p className="mt-1 line-clamp-1 text-[11px] font-medium leading-relaxed text-white/90 sm:text-xs">
          {priceLabel}
        </p>

        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/75 sm:text-xs">
          <Users
            className="h-3.5 w-3.5 shrink-0 text-white/70"
            aria-hidden="true"
          />
          <span>Up to {venue.capacity ?? "—"} guests</span>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedVenueCard;
