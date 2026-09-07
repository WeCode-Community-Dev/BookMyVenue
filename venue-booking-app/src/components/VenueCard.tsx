"use client";

import React from "react";
import Link from "next/link";
import { Venue } from "@/context/AppContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Users, MapPin, Star, ArrowRight } from "lucide-react";

const venueTypeLabels: Record<Venue["type"], string> = {
  conference: "Conference Room",
  wedding: "Wedding & Ballroom",
  coworking: "Co-working Space",
  studio: "Creative Studio",
  rooftop: "Rooftop Lounge",
  garden: "Garden Oasis",
};

const venueTypeColors: Record<Venue["type"], string> = {
  conference: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  wedding: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  coworking: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  studio: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  rooftop: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  garden: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
};

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const primaryImage = venue.images?.[0] || "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800";

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Venue Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={primaryImage}
          alt={venue.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Venue Type Badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
            venueTypeColors[venue.type] || "bg-secondary text-secondary-foreground"
          }`}
        >
          {venueTypeLabels[venue.type] || venue.type}
        </span>
      </div>

      <CardHeader className="p-5 pb-3">
        {/* Rating and Location Header */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="truncate max-w-[150px]">{venue.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{venue.rating.toFixed(1)}</span>
            <span>({venue.reviewsCount})</span>
          </div>
        </div>

        {/* Venue Name */}
        <h3 className="font-bold text-lg text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-1">
          {venue.name}
        </h3>
      </CardHeader>

      <CardContent className="px-5 py-0 flex-grow">
        {/* Description Snippet */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {venue.description}
        </p>

        {/* Capacity Detail */}
        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <span>Up to <strong className="text-foreground font-semibold">{venue.capacity} guests</strong></span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-border/60 flex items-center justify-between bg-muted/20 dark:bg-muted/5 mt-auto">
        {/* Pricing Info */}
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-bold text-foreground">${venue.pricePerHour}</span>
            <span className="text-xs text-muted-foreground">/ hr</span>
          </div>
          <span className="text-xxs text-muted-foreground">or ${venue.pricePerDay} / day</span>
        </div>

        {/* Link Button */}
        <Link href={`/venues/${venue.id}`} className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-medium text-sm px-4 py-2 shadow-sm transition-all group-hover:shadow hover:scale-[1.02]">
          Book Space
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
