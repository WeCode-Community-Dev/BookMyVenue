"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Star, Users, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useVenues } from "@/hooks/useVenues";

interface FeaturedVenuesProps {
    activeCategory: string;
}

const formatCategory = (category: string) =>
    category
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export function FeaturedVenues({ activeCategory }: FeaturedVenuesProps) {
    const [wishlist, setWishlist] = useState<number[]>([]);

    const { data, isLoading, error } = useVenues({ limit: 6 });
    const venues = data?.venues ?? [];

    const toggleWishlist = (id: number) => {
        setWishlist((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));
    };

    return (
        <section id="venues" className="py-16 bg-secondary/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                            Handpicked For You
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                            {activeCategory === "All" ? "Featured Venues" : `${activeCategory} Venues`}
                        </h2>
                    </div>
                    <button className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-3 transition-all">
                        View all venues <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                )}

                {error && !isLoading && (
                    <div className="text-center py-20 text-muted-foreground">
                        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-lg font-medium">Could not load venues. Please try again.</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map((venue) => {
                            const startingPrice = venue.sessions.length
                                ? Math.min(...venue.sessions.map((s) => s.price))
                                : null;

                            return (
                                <div
                                    key={venue.id}
                                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
                                            onClick={() => toggleWishlist(venue.id)}
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${wishlist.includes(venue.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                                            />
                                        </button>
                                        <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                                            {formatCategory(venue.category)}
                                        </span>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-foreground mb-1 leading-tight">
                                            {venue.name}
                                        </h3>
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
                                                <span className="text-xs text-muted-foreground">
                                                    ({venue.reviewCount})
                                                </span>
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
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            per session
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        Price on request
                                                    </span>
                                                )}
                                            </div>
                                            <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!isLoading && !error && venues.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-lg font-medium">No venues found.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
