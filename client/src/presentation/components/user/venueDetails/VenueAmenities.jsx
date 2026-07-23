export default function VenueAmenities({ amenities = [] }) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6">
      <h2 className="mb-5 text-2xl font-bold">
        Amenities & Features
      </h2>

      {amenities.length === 0 ? (
        <p className="text-gray-500">
          No amenities listed for this venue.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-3 rounded-xl border p-4"
            >
              <span className="text-xl">✓</span>

              <span className="text-gray-700">
                {amenity}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}