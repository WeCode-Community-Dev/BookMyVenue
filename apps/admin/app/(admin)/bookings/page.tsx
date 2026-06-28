"use client";

import { useEffect, useState } from "react";
import { Search, Download, CalendarCheck } from "lucide-react";
import { BOOKING_STATUS_STYLE } from "../../../components/data";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../../components/ui/table";
import { Booking, fetchBookings } from "../../actions/booking";
import { BookingStatus } from "@bookmyvenue/database/enums";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../../components/ui/pagination";
import { fmtAmount } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";

const PAGE_SIZE = 10;

export default function BookingsPage() {
    const [bookingSearch, setBookingSearch] = useState("");
    const [bookingFilter, setBookingFilter] = useState<BookingStatus | "All">("All");
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const bookingFilters: (BookingStatus | "All")[] = [
        "All",
        ...Object.values(BookingStatus).filter((status) => status !== BookingStatus.PENDING),
    ];

    useEffect(() => {
        fetchBookings("All", 1, PAGE_SIZE).then((result) => {
            setTotal(result.total);
            setBookings(result.bookings);
            setLoading(false);
        });
    }, []);

    const handleFilterChange = async (filter: BookingStatus | "All") => {
        setBookingFilter(filter);
        setPage(1);
        setLoading(true);
        fetchBookings(filter, 1, PAGE_SIZE).then((result) => {
            setTotal(result.total);
            setBookings(result.bookings);
            setLoading(false);
        });
    };

    const handlePageChange = async (p: number) => {
        setPage(p);
        setLoading(true);
        fetchBookings(bookingFilter, p, PAGE_SIZE).then((result) => {
            setTotal(result.total);
            setBookings(result.bookings);
            setLoading(false);
        });
    };

    const filteredBookings = bookings.filter((b) => {
        const mq =
            b.client.toLowerCase().includes(bookingSearch.toLowerCase()) ||
            b.venue.toLowerCase().includes(bookingSearch.toLowerCase()) ||
            b.id.toLowerCase().includes(bookingSearch.toLowerCase());
        return mq;
    });

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const pagedBookings = filteredBookings;

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, 4, null, totalPages];
        if (page >= totalPages - 2)
            return [1, null, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, null, page - 1, page, page + 1, null, totalPages];
    };

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                        className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Search by client, venue, booking ID…"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {bookingFilters.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleFilterChange(s)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${bookingFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
                        >
                            {s.toLocaleLowerCase()}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors shrink-0">
                    <Download className="w-3.5 h-3.5" /> Export
                </button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            {[
                                "Booking ID",
                                "Client",
                                "Venue",
                                "Owner",
                                "Date",
                                "Category",
                                "Amount",
                                "Status",
                            ].map((h) => (
                                <TableHead
                                    key={h}
                                    className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider"
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                  <TableRow key={i}>
                                      {Array.from({ length: 8 }).map((_, j) => (
                                          <TableCell key={j}>
                                              <Skeleton className="h-10 w-full" />
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              ))
                            : pagedBookings.map((b) => (
                                  <TableRow key={b.id} className="hover:bg-muted/30">
                                      <TableCell className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                                          {b.id}
                                      </TableCell>
                                      <TableCell className="px-5 py-3.5 font-semibold text-foreground capitalize">
                                          {b.client}
                                      </TableCell>
                                      <TableCell className="px-5 py-3.5 text-foreground/80">
                                          {b.venue}
                                      </TableCell>
                                      <TableCell className="px-5 py-3.5 text-foreground/70 capitalize">
                                          {b.owner}
                                      </TableCell>
                                      <TableCell className="px-5 py-3.5 text-foreground/70">
                                          {b.date}
                                      </TableCell>
                                      <TableCell className="px-5 py-3.5 text-foreground/70">
                                          {b.category}
                                      </TableCell>
                                      <TableCell className="px-5 py-3.5 font-bold text-foreground">
                                          {fmtAmount(b.amount)}
                                      </TableCell>
                                      <TableCell className="px-5 py-3.5">
                                          <span
                                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${BOOKING_STATUS_STYLE[b.status]}`}
                                          >
                                              {b.status}
                                          </span>
                                      </TableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
                {!loading && pagedBookings.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-25" />
                        <p className="font-medium">No bookings match your filter.</p>
                    </div>
                )}
            </div>

            <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}{" "}
                    of {total} bookings
                </span>
                <Pagination className="w-auto mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(Math.max(1, page - 1));
                                }}
                                aria-disabled={page === 1}
                                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        {getPageNumbers().map((n, i) =>
                            n === null ? (
                                <PaginationItem key={`ellipsis-${i}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={n}>
                                    <PaginationLink
                                        href="#"
                                        isActive={n === page}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(n);
                                        }}
                                    >
                                        {n}
                                    </PaginationLink>
                                </PaginationItem>
                            ),
                        )}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(Math.min(totalPages, page + 1));
                                }}
                                aria-disabled={page === totalPages}
                                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
