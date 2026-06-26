"use client";

import { useState } from "react";
import { Sparkles, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DISTRICTS, VENUE_CATEGORIES } from "@bookmyvenue/types";
import { useVenues } from "@/hooks/useVenues";
import { formatEnum } from "@/lib/utils";
import { VenueCard } from "@/components/VenueCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const PAGE_LIMIT = 50;
const ALL = "all";

export default function VenuesPage() {
    const [category, setCategory] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useVenues({
        category: category || undefined,
        district: district || undefined,
        page,
        limit: PAGE_LIMIT,
    });

    const venues = data?.venues ?? [];
    const pagination = data?.pagination;

    const updateCategory = (value: string) => {
        setCategory(value === ALL ? "" : value);
        setPage(1);
    };

    const updateDistrict = (value: string) => {
        setDistrict(value === ALL ? "" : value);
        setPage(1);
    };

    const clearFilters = () => {
        setCategory("");
        setDistrict("");
        setPage(1);
    };

    const hasFilters = category !== "" || district !== "";

    return (
        <section className="py-12 bg-secondary/40 min-h-[70vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
                        Explore
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">All Venues</h1>
                    {pagination && (
                        <p className="text-muted-foreground text-sm mt-2">
                            {pagination.total} venue{pagination.total === 1 ? "" : "s"} available
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <Select value={category || ALL} onValueChange={updateCategory}>
                        <SelectTrigger className="flex-1 w-full bg-card py-2.5 rounded-xl">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All categories</SelectItem>
                            {VENUE_CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {formatEnum(c)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={district || ALL} onValueChange={updateDistrict}>
                        <SelectTrigger className="flex-1 w-full bg-card py-2.5 rounded-xl">
                            <SelectValue placeholder="All districts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All districts</SelectItem>
                            {DISTRICTS.map((d) => (
                                <SelectItem key={d} value={d}>
                                    {formatEnum(d)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
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
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-primary font-semibold text-sm hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {!isLoading && !error && pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground border border-border rounded-xl hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Prev
                        </button>

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 text-sm font-semibold rounded-xl transition-colors ${
                                    p === page
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground border border-border hover:bg-muted"
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={page >= pagination.totalPages}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground border border-border rounded-xl hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
