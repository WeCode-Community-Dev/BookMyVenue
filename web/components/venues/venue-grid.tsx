"use client";

import { AddVenueCard } from "./add-venue-card";
import { VenueCard } from "./venue-card";
import { getOwnedVenues } from "@/services/venueServices";
import { useFetch } from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";

export function VenueGrid() {

  const { data: venues, isLoading, error } = useFetch(()=>getOwnedVenues());

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {venues?.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
      {error && <div className="text-red-500">{error.message}</div>}
      <AddVenueCard />
    </div>
  );
}
