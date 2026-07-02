import { MapPin, Star, Users } from "lucide-react";

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
  const isPending = venue.approval_status === "pending" || venue.approval_status === "pending_approval";
  const placeholderColor = placeholderColorFor(venue.id);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div
        className="h-32 relative"
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
          className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-md ${
            STATUS_BADGE[venue.approval_status] || STATUS_BADGE.pending
          }`}
        >
          {STATUS_LABEL[venue.approval_status] || "Pending Approval"}
        </span>
      </div>

      <div className="p-4">
        <h4 className="text-sm font-semibold text-rose-900">{venue.name}</h4>
        <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
          <MapPin size={12} /> {venue.location}
        </p>

        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users size={13} /> {venue.capacity ?? "—"} Guests
          </span>
          <span className="font-semibold text-gray-700">
            ₹{Number(venue.price_per_day).toLocaleString("en-IN")}/day
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          {isPending ? (
            <p className="text-[11px] text-gray-400">
              Submitted on{" "}
              {new Date(venue.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-600">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {venue.average_rating ?? "—"}{" "}
              <span className="text-gray-400">({venue.total_reviews ?? 0} reviews)</span>
            </span>
          )}
        </div>

        <button
          className={`w-full mt-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            isPending
              ? "border border-rose-200 text-rose-800 hover:bg-rose-50"
              : "bg-rose-900 hover:bg-rose-950 text-white"
          }`}
        >
          {isPending ? "Check Status" : "Manage"}
        </button>
      </div>
    </div>
  );
}

function MyVenuesGrid({ venues, loading }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-rose-900">My Venues</h3>
        <button className="text-xs font-medium text-rose-700 hover:underline">View all venues</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-gray-50 animate-pulse" />
            ))
          : venues.map((v) => <VenueCard key={v.id} venue={v} />)}
      </div>
    </div>
  );
}

export default MyVenuesGrid;
