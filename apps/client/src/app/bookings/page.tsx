"use client";

import { useState } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

import { fmt, STATUS_DOT, STATUS_STYLE, type BookingStatus } from "@/app/owner/types";
import { useUserBookings } from "@/hooks/useBooking";
import { fmt12h, fmtDate, formatEnum } from "@/lib/utils";
import type { GetBookingQuery } from "@bookmyvenue/types";
import { Button } from "@/components/ui/button";

const FILTERS = ["All", "Confirmed", "Cancelled"] as const;
const PAGE_SIZE = 10;

const toTitleStatus = (s: string): BookingStatus => (s.charAt(0) + s.slice(1).toLowerCase()) as BookingStatus;

export default function MyBookingsPage() {
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
    const [page, setPage] = useState(1);

    const statusParam = filter === "All" ? undefined : (filter.toUpperCase() as GetBookingQuery["status"]);

    const { data, isLoading, isError, error } = useUserBookings({
        status: statusParam,
        page,
        limit: PAGE_SIZE,
    });

    const bookings = data?.bookings ?? [];
    const totalPages = data?.pagination.totalPages ?? 1;
    const currentPage = data?.pagination.page ?? page;

    const handleFilter = (f: (typeof FILTERS)[number]) => {
        setPage(1);
        setFilter(f);
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">My Bookings</h1>
                <p className="text-sm text-muted-foreground">
                    View and track all the venues you&apos;ve booked.
                </p>
            </div>

            {/* Status filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => handleFilter(f)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                            filter === f
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-secondary"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* States */}
            {isLoading && (
                <div className="py-20 text-center text-sm text-muted-foreground">Loading your bookings…</div>
            )}

            {isError && !isLoading && (
                <div className="py-20 text-center text-sm text-red-600">
                    {error instanceof Error ? error.message : "Failed to load bookings."}
                </div>
            )}

            {!isLoading && !isError && bookings.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                    <CalendarCheck className="mx-auto mb-3 h-10 w-10 opacity-25" />
                    <p className="font-medium">You don&apos;t have any bookings yet.</p>
                </div>
            )}

            {/* Bookings list */}
            <div className="flex flex-col gap-4">
                {bookings.map((b) => {
                    const status = toTitleStatus(b.status);
                    return (
                        <div
                            key={b.id}
                            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/30"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h2 className="truncate font-bold text-foreground">{b.venue.name}</h2>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                                        {b.venue.location}, {formatEnum(b.venue.district)}
                                    </p>
                                </div>
                                <span
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
                                    {status}
                                </span>
                            </div>

                            {/* Sessions */}
                            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                                {b.sessions.map((s, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-wrap items-center justify-between gap-2 text-sm"
                                    >
                                        <div className="flex items-center gap-2 text-foreground">
                                            <CalendarCheck className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{fmtDate(s.eventDate)}</span>
                                            <span className="text-muted-foreground">·</span>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                {s.session.label} ({fmt12h(s.session.startTime)} –{" "}
                                                {fmt12h(s.session.endTime)})
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground">{fmt(s.pricePaid)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                                <span className="font-mono">#{b.id.slice(0, 8)}</span>
                                {b.purpose && <span className="truncate">{b.purpose}</span>}
                                <span className="font-bold text-foreground">Total: {fmt(b.totalAmount)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
