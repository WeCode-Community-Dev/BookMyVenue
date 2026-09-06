export default function VenueHeader({ venue }) {
  return (
    <div className="mt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            {venue.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {venue.name}
          </h1>

          <p className="mt-2 text-gray-500">
            📍 {venue.address?.addressLine1},{" "}
            {venue.address?.city},{" "}
            {venue.address?.state}
          </p>
        </div>

        <button
          type="button"
          className="rounded-full border px-4 py-2"
        >
          🤍 Save
        </button>
      </div>

      <div className="mt-5 flex gap-6 text-sm">
        <span>⭐ {venue.rating || 0}</span>

        <span>
          🪑 {venue.seatingCapacity} Seating
        </span>

        <span>
          🧍 {venue.standingCapacity} Standing
        </span>
                <span>
           {venue.minimumBookingHours} hours of Minimum Booking Hour
        </span>

      </div>
    </div>
  );
}