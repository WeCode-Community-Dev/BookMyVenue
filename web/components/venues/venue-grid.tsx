import { venues } from "@/lib/data/venues";

import { AddVenueCard } from "./add-venue-card";
import { VenueCard } from "./venue-card";

export function VenueGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
      <AddVenueCard />
    </div>
  );
}
