import React from "react";
import Link from "next/link";
import { VenueCard } from "./venue-card";
import { Venue } from "@/types";

interface VenueSectionProps {
  title: string;
  description?: string;
  venues: Venue[];
}

export function VenueSection({ title, description, venues }: VenueSectionProps) {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
            {description && <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{description}</p>}
          </div>
          <Link href="/search" className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer self-start sm:self-auto select-none bg-transparent border-none">
            View all &rarr;
          </Link>
        </div>

        {/* Section Grid */}
        {venues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-sm font-medium text-slate-400">No venues found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
