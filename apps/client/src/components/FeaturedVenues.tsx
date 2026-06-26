"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useVenues } from "@/hooks/useVenues";
import { VenueCard } from "@/components/VenueCard";

interface FeaturedVenuesProps {
    activeCategory: string;
}

export function FeaturedVenues({ activeCategory }: FeaturedVenuesProps) {
    const { data, isLoading, error } = useVenues({ limit: 6 });
    const venues = data?.venues ?? [];

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
                    <Link
                        href="/venues"
                        className="flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-3 transition-all"
                    >
                        View all venues <ArrowRight className="w-4 h-4" />
                    </Link>
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
                        {venues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
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
