import React from "react";
import VenueCard from "./VenueCard";

const VenueGrid = ({ venues = [], loading = false, error = "", viewMode = "grid", onEdit }) => {
  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!venues.length) {
    return <p className="text-sm text-gray-500">No venues found.</p>;
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {venues.map((venue) => {
          const image = venue.images?.[0]?.url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3";
          const location = venue.address?.city
            ? `${venue.address.city}, ${venue.address.state || ""}`.trim()
            : "Location not available";

          return (
            <div key={venue.id} className="flex flex-col md:flex-row gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="h-48 w-full md:w-56 overflow-hidden rounded-3xl bg-slate-100">
                <img src={image} alt={venue.name} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-lg font-semibold">{venue.name}</h3>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                    {venue.approvalStatus}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-2">{location}</p>
                <p className="text-sm text-slate-500 mb-3">Category: {venue.category}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                  <span>{venue.seatingCapacity || 0} seats</span>
                  <span>₹{venue.pricePerDay || venue.pricePerHour || 0}</span>
                  <span>{venue.rating?.toFixed(1) || 0} ★</span>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => onEdit?.(venue.id)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit venue
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {venues.map((venue) => {
        const image = venue.images?.[0]?.url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3";
        const location = venue.address?.city
          ? `${venue.address.city}, ${venue.address.state || ""}`.trim()
          : "Location not available";

        return (
          <VenueCard
            key={venue.id}
            image={image}
            name={venue.name}
            location={location}
            guests={venue.seatingCapacity || 0}
            price={venue.pricePerDay || venue.pricePerHour || 0}
            bookings={0}
            rating={venue.rating || 0}
            category={venue.category}
            status={venue.approvalStatus}
            onEdit={() => onEdit?.(venue.id)}
          />
        );
      })}
    </div>
  );
};

export default VenueGrid;