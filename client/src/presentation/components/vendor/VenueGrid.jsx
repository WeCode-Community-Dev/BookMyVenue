import React from "react";
import VenueCard from "./VenueCard";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const VenueGrid = ({
  venues = [],
  loading = false,
  error = "",
  viewMode = "grid",
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading || error) {
    return null;
  }

  if (!venues.length) {
    return <p className="text-sm text-gray-500">No venues found.</p>;
  }

  // =========================
  // LIST VIEW
  // =========================

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {venues.map((venue) => {
          const image =
            venue.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3";

          const location = venue.address?.city
            ? `${venue.address.city}, ${venue.address.state || ""}`.trim()
            : "Location not available";

          return (
            <div
              key={venue.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row"
            >
              {/* Image */}
              <div className="h-48 w-full overflow-hidden rounded-3xl bg-slate-100 md:w-56">
                <img
                  src={image}
                  alt={venue.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">
                    {venue.name}
                  </h3>

                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                    {venue.approvalStatus}
                  </span>
                </div>

                <p className="mb-2 text-sm text-slate-500">
                  {location}
                </p>

                <p className="mb-3 text-sm text-slate-500">
                  Category: {venue.category}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                  <span>
                    {venue.seatingCapacity || 0} seats
                  </span>

                  <span>
                    ₹
                    {venue.pricePerDay ||
                      venue.pricePerHour ||
                      0}
                  </span>

                  <span>
                    {venue.rating?.toFixed(1) || 0} ★
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => onView?.(venue.id)}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => onEdit?.(venue.id)}
                  >
                    Edit Venue
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => onDelete?.(venue.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // =========================
  // GRID VIEW
  // =========================

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {venues.map((venue) => {
        const image =
          venue.images?.[0]?.url ||
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3";

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
            price={
              venue.pricePerDay ||
              venue.pricePerHour ||
              0
            }
            bookings={0}
            rating={venue.rating || 0}
            category={venue.category}
            status={venue.approvalStatus}
            onView={() => onView?.(venue.id)}
            onEdit={() => onEdit?.(venue.id)}
            onDelete={() => onDelete?.(venue.id)}
          />
        );
      })}
    </div>
  );
};

export default VenueGrid;