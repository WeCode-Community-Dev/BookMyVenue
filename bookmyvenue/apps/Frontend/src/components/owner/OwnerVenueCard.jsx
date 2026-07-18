import { Link } from "@tanstack/react-router";

function OwnerVenueCard({
  venue,
  onEdit,
  onDelete,
  onManage,
  onViewBookings,
  showActions = true,
}) {
  const {
    id,
    name,
    location,
    imageUrl,
    rating,
    reviewCount,
    capacity,
    pricePerHour,
    status = "active",
  } = venue;

  const statusStyles = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800",
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.(venue);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(venue);
  };

  const handleManageClick = (e) => {
    e.stopPropagation();
    onManage?.(venue);
  };

  const handleBookingsClick = (e) => {
    e.stopPropagation();
    onViewBookings?.(venue);
  };

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-200 hover:shadow-xl"
      role="article"
      aria-label={`My venue: ${name}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl || "/placeholder-venue.jpg"}
          alt={`${name} venue`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
              statusStyles[status] || statusStyles.inactive
            }`}
          >
            {status}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-sm font-medium text-gray-900 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating ?? "—"}
          {reviewCount != null && (
            <span className="text-xs text-gray-500">({reviewCount})</span>
          )}
        </div>
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

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {capacity != null && (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
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
          {pricePerHour != null && (
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
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
              <span>${pricePerHour}/hr</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="mt-auto flex flex-col gap-2 pt-5">
            <div className="flex gap-2">
              <Link
                to={`/owner/venues/${id}/edit`}
                onClick={handleEditClick}
                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                Edit
              </Link>
              <Link
                to={`/owner/venues/${id}/bookings`}
                onClick={handleBookingsClick}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Bookings
              </Link>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleManageClick}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Manage
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerVenueCard;
