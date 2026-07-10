import { ExternalLink, MapPin } from "lucide-react";
import {
  getVenueAddressDisplay,
  getVenueGoogleMapsUrl,
  hasVenueLocationData,
} from "../../utils/venueLocation";

const VenueLocation = ({ venue, className = "" }) => {
  if (!venue || !hasVenueLocationData(venue)) {
    return null;
  }

  const { title, lines } = getVenueAddressDisplay(venue);
  const mapsUrl = getVenueGoogleMapsUrl(venue);

  if (!lines.length && !title) {
    return null;
  }

  return (
    <section
      id="venue-location"
      className={`scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 ring-1 ring-gray-100/80 sm:p-5 ${className}`}
      aria-labelledby="venue-location-heading"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h2
          id="venue-location-heading"
          className="min-w-0 text-base font-semibold text-gray-900 sm:text-lg"
        >
          Venue location
        </h2>
      </div>

      <div className="mt-3 min-w-0 space-y-2">
        {title && (
          <p className="break-words text-sm font-semibold leading-snug text-gray-900 sm:text-[15px]">
            {title}
          </p>
        )}

        {lines.map(({ key, label, value }) => (
          <div key={key} className="min-w-0">
            {label ? (
              <p className="text-sm leading-relaxed text-gray-700 sm:text-[15px]">
                <span className="font-medium text-gray-500">{label}: </span>
                <span className="break-words text-gray-800">{value}</span>
              </p>
            ) : (
              <p className="break-words text-sm leading-relaxed text-gray-800 sm:text-[15px]">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-colors hover:bg-red-700 sm:max-w-sm"
        >
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Location</span>
          <ExternalLink
            className="h-3.5 w-3.5 shrink-0 opacity-80"
            aria-hidden="true"
          />
        </a>
      )}
    </section>
  );
};

export default VenueLocation;
