import { useNavigate } from "react-router-dom";
function VenueCard({ venue }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

      <img
        src={venue.images?.[0]?.url}
        alt={venue.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mb-2">
          {venue.venueCategory.name}
        </span>

        <h2 className="text-xl font-bold text-gray-800">
          {venue.name}
        </h2>

        <p className="text-gray-600 mt-2 text-sm">
          {venue.description}
        </p>

        <div className="mt-4 space-y-1 text-sm text-gray-500">
          <p>📍 {venue.city}, {venue.state}</p>
          <p>👥 Capacity: {venue.capacity}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            ₹{venue.basePrice.toLocaleString()}
          </span>

          <button
            onClick={() => navigate(`/venue/${venue._id}`)}
            className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default VenueCard;