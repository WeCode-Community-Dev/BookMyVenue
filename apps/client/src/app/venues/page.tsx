"use client";

import { Suspense } from "react";
import { District, VenueCategory } from "@bookmyvenue/database";
import { Sparkles, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { DISTRICTS, VENUE_CATEGORIES } from "@bookmyvenue/types";
import { useVenues } from "@/hooks/useVenues";
import { formatEnum } from "@/lib/utils";
import { VenueCard } from "@/components/VenueCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PAGE_LIMIT = 50;
const ALL = "all";

function VenuesPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const category = searchParams.get("category") as VenueCategory | null;
    const district = searchParams.get("district") as District | null;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const { data, isLoading, error } = useVenues({
        category: category ?? undefined,
        district: district ?? undefined,
        page,
        limit: PAGE_LIMIT,
    });

    const venues = data?.venues ?? [];
    const pagination = data?.pagination;

    const updateSearchParams = (updates: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
                return;
            }
            params.set(key, String(value));
        });

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    const updateCategory = (value: string) => {
        updateSearchParams({
            category: value === ALL ? null : value,
            page: null,
        });
    };

    const updateDistrict = (value: string) => {
        updateSearchParams({
            district: value === ALL ? null : value,
            page: null,
        });
    };

    const updatePage = (page: number) => {
        updateSearchParams({
            page: page === 1 ? null : page,
        });
    };

    const clearFilters = () => {
        router.push(pathname);
    };

    const hasFilters = category !== null || district !== null;

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
                        <SelectContent position="popper">
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
                        <SelectContent position="popper">
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
                            className="flex items-center justify-center gap-1.5 px-3 py-1 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-colors"
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
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button
                            onClick={() => updatePage(page - 1)}
                            disabled={page <= 1}
                            className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </button>

                        {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
                            (pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => updatePage(pageNumber)}
                                    className={`h-10 w-10 rounded-xl text-sm font-semibold transition-colors ${
                                        pageNumber === page
                                            ? "bg-primary text-primary-foreground"
                                            : "border border-border text-foreground hover:bg-muted"
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            ),
                        )}

                        <button
                            onClick={() => updatePage(page + 1)}
                            disabled={page >= pagination.totalPages}
                            className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function VenuesPage() {
    return (
        <Suspense>
            <VenuesPageContent />
        </Suspense>
    );
}
