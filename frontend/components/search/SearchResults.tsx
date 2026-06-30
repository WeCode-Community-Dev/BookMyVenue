import React from "react";
import VenueCard from "./VenueCard";
import { Venue } from "@/types";

interface SearchResultsProps {
  venues: Venue[];
}

export default function SearchResults({ venues }: SearchResultsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6 py-4">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
