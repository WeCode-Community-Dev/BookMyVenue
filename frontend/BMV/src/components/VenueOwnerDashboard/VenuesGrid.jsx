import { Link } from "react-router-dom";
import { MapPin, Star, Users, IndianRupee } from "lucide-react";

const STATUS_BADGE = {
  approved: "bg-emerald-500 text-white",
  pending_approval: "bg-amber-500 text-white",
  pending: "bg-amber-500 text-white",
  rejected: "bg-gray-400 text-white",
};

const STATUS_LABEL = {
  approved: "Approved",
  pending_approval: "Pending Approval",
  pending: "Pending Approval",
  rejected: "Rejected",
};

const PLACEHOLDER_COLORS = [
  "#3b1f2b",
  "#1f2937",
  "#4a2c1a",
  "#1e3a3a",
  "#3a1e3a",
];

function placeholderColorFor(id) {
  const index = Number(id) % PLACEHOLDER_COLORS.length;
  return PLACEHOLDER_COLORS[Number.isNaN(index) ? 0 : index];
}

function VenueCard({ venue }) {
  const placeholderColor = placeholderColorFor(venue.id);
  const hasRating = venue.average_rating != null && venue.average_rating > 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div
        className="h-40 relative"
        style={
          venue.image_url
            ? {
                backgroundImage: `url(${venue.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: `linear-gradient(135deg, ${placeholderColor}, ${placeholderColor}cc)`,
              }
        }
      >
        <span
          className={`absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            STATUS_BADGE[venue.approval_status] || STATUS_BADGE.pending
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {STATUS_LABEL[venue.approval_status] || "Pending Approval"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-rose-900 leading-snug">
            {venue.name}
          </h4>
          <span className="flex items-center gap-1 shrink-0 mt-0.5">
            <Star
              size={13}
              className={hasRating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
            />
            <span className={`text-xs font-medium ${hasRating ? "text-gray-700" : "text-gray-400"}`}>
              {hasRating ? venue.average_rating : "N/A"}
            </span>
          </span>
        </div>

        <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
          <MapPin size={12} /> {venue.location}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 tracking-wide">
              CAPACITY
            </p>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mt-1">
              <Users size={13} className="text-rose-800" />
              {venue.capacity ?? "—"} Guests
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 tracking-wide">
              DAILY RATE
            </p>
            <p className="flex items-center gap-1 text-sm font-semibold text-gray-800 mt-1">
              <IndianRupee size={13} className="text-emerald-600" />
              {Number(venue.price_per_day).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-colors">
            Manage
          </button>
          <button className="flex-1 py-2 rounded-lg border border-rose-200 text-rose-800 hover:bg-rose-50 text-xs font-semibold transition-colors">
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}

function VenuesGrid({ venues, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[340px] rounded-2xl bg-gray-50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
        <p className="text-sm text-gray-500">
          You haven&apos;t added any venues yet.
        </p>
        <Link
          to="/owner/venues/new"
          className="inline-block mt-3 text-sm font-semibold text-rose-800 hover:underline"
        >
          Add your first venue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {venues.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  );
}

export default VenuesGrid;