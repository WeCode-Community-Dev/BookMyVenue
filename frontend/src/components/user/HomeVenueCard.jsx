import { useNavigate } from "react-router-dom";
export default function HomeVenueCard({ venue }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <img
        src={venue.images?.[0]?.url}
        alt={venue.name}
        className="h-48 w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold">
          {venue.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {venue.venueCategory.name}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          📍 {venue.district}
        </p>

        <div className="mt-auto flex justify-end pt-4">
          <button
            onClick={() => navigate(`/venue/${venue._id}`)}
            className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white">
            View Venue
          </button>
        </div>
      </div>
    </div>
  );
}