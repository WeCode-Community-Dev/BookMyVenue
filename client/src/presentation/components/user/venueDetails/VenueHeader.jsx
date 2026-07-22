export default function VenueHeader({ venue }) {
  return (
    <div className="mt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {venue.category}
          </p>

          <h1 className="text-3xl font-bold mt-2">
            {venue.name}
          </h1>

          <p className="text-gray-500 mt-2">
            📍 {venue.address?.addressLine1},{" "}
            {venue.address?.city},{" "}
            {venue.address?.state}
          </p>
        </div>

        <button className="border rounded-full px-4 py-2">
          🤍 Save
        </button>
      </div>

      <div className="flex gap-6 mt-5 text-sm">
        <span>
          ⭐ {venue.rating || 0}
        </span>

        <span>
          🪑 {venue.seatingCapacity} Seating
        </span>

        <span>
          🧍 {venue.standingCapacity} Standing
        </span>
      </div>
    </div>
  );
}