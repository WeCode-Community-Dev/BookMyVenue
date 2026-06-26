"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Users } from "lucide-react";
import type { Venue } from "@/lib/api/venue";
import { formatEnum } from "@/lib/utils";

interface VenueCardProps {
    venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
    const [wishlisted, setWishlisted] = useState(false);

    const startingPrice = venue.sessions.length
        ? Math.min(...venue.sessions.map((s) => s.price))
        : null;

    return (
        <Link
            href={`/venues/${venue.id}`}
            className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className="relative h-52 bg-muted overflow-hidden">
                <Image
                    src={venue.images[0] ?? "/placeholder-venue.jpg"}
                    alt={venue.name}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    onClick={(e) => {
                        e.preventDefault();
                        setWishlisted((prev) => !prev);
                    }}
                >
                    <Heart
                        className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                </button>
                <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                    {formatEnum(venue.category)}
                </span>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg text-foreground mb-1 leading-tight">{venue.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>
                        {venue.location}, {venue.district}
                    </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-foreground">
                            {venue.averageRating?.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
                    </div>
                    <span className="text-border">·</span>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Users className="w-3.5 h-3.5" />
                        <span>{venue.capacity} guests</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                        {startingPrice !== null ? (
                            <>
                                <span className="text-lg font-bold text-primary">
                                    ₹{startingPrice.toLocaleString("en-IN")}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">per session</span>
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground">Price on request</span>
                        )}
                    </div>
                    <button
                        className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </Link>
    );
}
