import { Link } from "react-router-dom";
import { Star } from "lucide-react";

function VenueCard({ venue }) {
  const rating = venue.average_rating ? Number(venue.average_rating) : 0;
  const reviewCount = venue.total_reviews || 0;

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-rose-200 transition-all"
    >
      {venue.image_url ? (
        <img src={venue.image_url} alt={venue.name} className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-sm">
          No image
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800">{venue.name}</h3>
        <p className="text-sm text-slate-400 mt-0.5">{venue.location}</p>
        {venue.venue_type && (
          <p className="text-xs text-rose-800 mt-1">{venue.venue_type.name}</p>
        )}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-slate-600">{rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">
              ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
            </span>
          </div>
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
