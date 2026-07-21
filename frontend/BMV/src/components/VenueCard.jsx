import { Link } from "react-router-dom";

function VenueCard({ venue }) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-blue-100 transition-all"
    >
      {venue.image_url ? (
        <img src={venue.image_url} alt={venue.name} className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
          No image
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800">{venue.name}</h3>
        <p className="text-sm text-slate-400 mt-0.5">{venue.location}</p>
        {venue.venue_type && (
          <p className="text-xs text-blue-600 mt-1">{venue.venue_type.name}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-bold text-slate-800">
            ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
            <span className="text-xs font-normal text-slate-400"> /day</span>
          </p>
          {venue.capacity && (
            <p className="text-xs text-slate-400">Up to {venue.capacity} guests</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default VenueCard;
