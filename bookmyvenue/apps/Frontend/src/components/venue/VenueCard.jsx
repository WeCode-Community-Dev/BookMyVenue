import { Link } from "react-router-dom";

function VenueCard({
    venue,
  onViewDetails,
  showActions = true,
}) {
  const {
      id,
      name,
      city,
      address_line,
      images,
      capacity,
      hourly_price,
      daily_price,
    } = venue;

    const imageUrl = images && images.length > 0 ? images[0].image_url : null;
    const location = city || address_line || "";
        const supportsHourly = hourly_price != null;
    const supportsDaily = daily_price != null;

  

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onViewDetails?.(venue);
  };

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-200 hover:shadow-xl"
      onClick={handleDetailsClick}
      role="article"
      aria-label={`Venue: ${name}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl || "/placeholder-venue.jpg"}
          alt={`${name} venue`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
                {/* Rating badge removed — not yet available from backend */}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{name}</h3>

        <div className="mt-1 flex items-start gap-1.5 text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{location}</span>
        </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          {capacity != null && (
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Up to {capacity}</span>
            </div>
          )}

          <div className="flex flex-col">
            {supportsHourly && (
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>₹{hourly_price}/hr</span>
              </div>
            )}
                        {supportsDaily && (
              <div className="flex items-center gap-1.5 pl-6 text-sm text-gray-600">
                <span>₹{daily_price}/day</span>
              </div>
            )}
          </div>
        </div>

                {showActions && (
          <div className="mt-auto pt-5">
            <Link
              to={`/venues/${id}`}
              onClick={handleDetailsClick}
              className="block w-full rounded-lg bg-red-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              View details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueCard;
