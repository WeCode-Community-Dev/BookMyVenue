import React from "react";
import VenueCard from "./VenueCard";
import { Venue } from "@/types";

interface SearchResultsProps {
  venues: Venue[];
}

export default function SearchResults({ venues }: SearchResultsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4 animate-in fade-in duration-300">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
