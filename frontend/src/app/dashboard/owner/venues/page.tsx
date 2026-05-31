"use client";

import React from "react";
import { Building2, Plus, Star, MapPin } from "lucide-react";

const venuesList = [
  {
    id: 1,
    name: "The Glasshouse",
    location: "Glasshouse Drive, NY",
    rating: "4.9",
    capacity: "250 guests",
    price: "$4,500/day",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Industrial Loft",
    location: "SOHO Arts District, NY",
    rating: "4.8",
    capacity: "120 guests",
    price: "$2,800/day",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e3a9?w=300&auto=format&fit=crop&q=80",
  },
];

export default function MyVenuesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">My Venues</h1>
          <p className="mt-1.5 text-body-md text-text-muted">Manage your premium event spaces.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[#582200] px-5 py-2.5 text-label-md font-bold text-white shadow-md hover:bg-[#3c2d26] transition-all">
          <Plus className="h-4.5 w-4.5" />
          <span>New Listing</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {venuesList.map((venue) => (
          <div key={venue.id} className="group overflow-hidden rounded-2xl bg-white border border-border-subtle shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={venue.image}
                alt={venue.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-on-surface backdrop-blur-sm">
                Active
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-on-surface group-hover:text-primary-container transition-colors">
                  {venue.name}
                </h3>
                <div className="flex items-center gap-1 text-label-sm font-semibold text-on-surface">
                  <Star className="h-3.5 w-3.5 fill-current text-primary-container" />
                  <span>{venue.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-label-sm text-text-muted">
                <MapPin className="h-3.5 w-3.5" />
                <span>{venue.location}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border-subtle/50 pt-3 mt-4">
                <span className="text-label-sm text-text-muted">{venue.capacity}</span>
                <span className="text-label-md font-bold text-primary-container">{venue.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
