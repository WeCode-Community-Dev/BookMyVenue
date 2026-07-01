import { CalendarCheck, Search } from "lucide-react";
import { useState } from "react";
import { fmt, STATUS_DOT, STATUS_STYLE, type BookingStatus } from "@/app/owner/types";
import { useOwnerBookings } from "@/hooks/useBooking";
import type { GetBookingQuery } from "@bookmyvenue/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { fmtDate, pageRange } from "@/lib/utils";

const toTitleStatus = (s: string): BookingStatus => (s.charAt(0) + s.slice(1).toLowerCase()) as BookingStatus;

const PAGE_SIZE = 10;


export default function BookingsTab() {
    const [bookingFilter, setBookingFilter] = useState<BookingStatus | "All">("All");
    const [searchQ, setSearchQ] = useState("");
    const [page, setPage] = useState(1);

    const statusParam =
        bookingFilter === "All" ? undefined : (bookingFilter.toUpperCase() as GetBookingQuery["status"]);

    // Reset to the first page whenever the status filter changes.
    const handleFilterChange = (filter: BookingStatus | "All") => {
        setPage(1);
        setBookingFilter(filter);
    };

    const { data, isLoading, isError, error } = useOwnerBookings({
        status: statusParam,
        page,
        limit: PAGE_SIZE,
    });

    const totalPages = data?.pagination.totalPages ?? 1;
    const currentPage = data?.pagination.page ?? page;

    const rows = (data?.bookings ?? []).filter((b) => {
        const q = searchQ.toLowerCase();
        return (
            (b.customer.name ?? "").toLowerCase().includes(q) ||
            b.venue.name.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q)
        );
    });

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Filters */}
            <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                        className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Search by client, venue, or booking ID..."
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 shrink-0">
                    {(["All", "Confirmed", "Cancelled"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => handleFilterChange(s)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                bookingFilter === s
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-secondary"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table className="text-sm">
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            {["Booking ID", "Client", "Venue", "Date", "Purpose", "Amount", "Status"].map(
                                (h) => (
                                    <TableHead
                                        key={h}
                                        className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </TableHead>
                                ),
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((b) => {
                            const status = toTitleStatus(b.status);
                            return (
                                <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                                        {b.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="px-5 py-3.5">
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {b.customer.name ?? "—"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{b.phone ?? "—"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-3.5 text-foreground/80 whitespace-nowrap">
                                        {b.venue.name}
                                    </TableCell>
                                    <TableCell className="px-5 py-3.5 text-foreground/70 whitespace-nowrap">
                                        {b.sessions[0] ? fmtDate(b.sessions[0].eventDate) : "—"}
                                    </TableCell>
                                    <TableCell className="px-5 py-3.5 text-foreground/70">
                                        {b.purpose ?? "—"}
                                    </TableCell>
                                    <TableCell className="px-5 py-3.5 font-bold text-foreground whitespace-nowrap">
                                        {fmt(b.totalAmount)}
                                    </TableCell>
                                    <TableCell className="px-5 py-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status]}`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`}
                                            />
                                            {status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {isLoading && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="font-medium">Loading bookings…</p>
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="text-center py-16 text-red-600">
                        <p className="font-medium">
                            {error instanceof Error ? error.message : "Failed to load bookings."}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && rows.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-25" />
                        <p className="font-medium">No bookings match your filter.</p>
                    </div>
                )}
            </div>

            <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    Showing {rows.length} of {data?.pagination.total ?? 0} bookings
                </span>
                {totalPages > 1 && (
                    <Pagination className="mx-0 w-auto justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    aria-disabled={currentPage <= 1}
                                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) setPage(currentPage - 1);
                                    }}
                                />
                            </PaginationItem>
                            {pageRange(currentPage, totalPages).map((p, i) =>
                                p === "ellipsis" ? (
                                    <PaginationItem key={`ellipsis-${i}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={p}>
                                        <PaginationLink
                                            href="#"
                                            isActive={p === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(p);
                                            }}
                                        >
                                            {p}
                                        </PaginationLink>
                                    </PaginationItem>
                                ),
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    aria-disabled={currentPage >= totalPages}
                                    className={
                                        currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) setPage(currentPage + 1);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    );
}
