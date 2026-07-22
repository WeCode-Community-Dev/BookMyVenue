export default function VenueAmenities({ amenities = [] }) {
  return (
    <section className="bg-white rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-5">
        Amenities & Features
      </h2>

      {amenities.length === 0 ? (
        <p className="text-gray-500">
          No amenities listed for this venue.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border rounded-xl p-4"
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