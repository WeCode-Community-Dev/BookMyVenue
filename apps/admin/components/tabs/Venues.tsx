"use client";

import { useState, useEffect } from "react";
import { Search, AlertTriangle, CheckCircle2, XCircle, Eye, Ban, Building2 } from "lucide-react";
import { VENUE_STATUS_STYLE, VenueStatus } from "../data";
import { fetchAllVenues, fetchPendingVenues, fetchApproved, approveVenue as approveVenueAction, rejectVenue as rejectVenueAction } from "../../app/actions/venue";
import type { Venue } from "../../app/actions/venue";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "../ui/pagination";
import Image from "next/image";
import { VenueDetailModal } from "../VenueDetailModal";

const PAGE_SIZE = 10;

export function VenuesPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [total, setTotal] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [venueSearch, setVenueSearch] = useState("");
    const [venueFilter, setVenueFilter] = useState<VenueStatus | "All">("All");
    const [page, setPage] = useState(1);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [rejectTarget, setRejectTarget] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchPage = async (filter: VenueStatus | "All", p: number) => {
        let result;
        if (filter === "All") result = await fetchAllVenues(p, PAGE_SIZE);
        else if (filter === "Pending") result = await fetchPendingVenues(p, PAGE_SIZE);
        else result = await fetchApproved(p, PAGE_SIZE);
        setVenues(result.venues);
        setTotal(result.total);
    };

    useEffect(() => {
        fetchAllVenues(1, PAGE_SIZE).then((result) => {
            setVenues(result.venues);
            setTotal(result.total);
        });
        fetchPendingVenues(1, 1).then((result) => setPendingCount(result.total));
    }, []);

    const handleFilterChange = async (filter: VenueStatus | "All") => {
        setVenueFilter(filter);
        setPage(1);
        await fetchPage(filter, 1);
    };

    const handlePageChange = async (p: number) => {
        setPage(p);
        await fetchPage(venueFilter, p);
    };

    const filteredVenues = venues.filter((v) => {
        const mq =
            v.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
            v.owner.toLowerCase().includes(venueSearch.toLowerCase()) ||
            v.location.toLowerCase().includes(venueSearch.toLowerCase());
        return mq;
    });

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const pagedVenues = filteredVenues;

    const handleApprove = async (id: string) => {
        setLoadingId(id);
        try {
            await approveVenueAction(id);
            setVenues((v) => v.map((x) => (x.id === id ? { ...x, status: "Approved" as VenueStatus } : x)));
            setPendingCount((c) => Math.max(0, c - 1));
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectTarget || !rejectReason.trim()) return;
        setLoadingId(rejectTarget);
        try {
            await rejectVenueAction(rejectTarget, rejectReason.trim());
            setVenues((v) => v.map((x) => (x.id === rejectTarget ? { ...x, status: "Rejected" as VenueStatus } : x)));
            setPendingCount((c) => Math.max(0, c - 1));
            setRejectTarget(null);
            setRejectReason("");
        } finally {
            setLoadingId(null);
        }
    };

    const suspendVenue = (id: string) =>
        setVenues((v) => v.map((x) => (x.id === id ? { ...x, status: "Inactive" } : x)));

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, 4, null, totalPages];
        if (page >= totalPages - 2)
            return [1, null, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, null, page - 1, page, page + 1, null, totalPages];
    };

    return (
        <>
        <VenueDetailModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} />

        {rejectTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
                    <h2 className="font-semibold text-foreground">Reject Venue</h2>
                    <p className="text-sm text-muted-foreground">Provide a reason so the owner knows what to fix.</p>
                    <textarea
                        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        rows={4}
                        placeholder="Enter rejection reason…"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                            className="px-4 py-2 rounded-xl text-sm bg-muted text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={!rejectReason.trim() || loadingId === rejectTarget}
                            className="px-4 py-2 rounded-xl text-sm bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            {loadingId === rejectTarget ? "Rejecting…" : "Reject"}
                        </button>
                    </div>
                </div>
            </div>
        )}
        <div className="space-y-4">

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Filters */}
                <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input
                            className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Search venues, owners, locations…"
                            value={venueSearch}
                            onChange={(e) => setVenueSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(["All", "Approved", "Pending"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => handleFilterChange(s)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${venueFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
                            >
                                {s}
                                {s === "Pending" && pendingCount > 0 && (
                                    <span
                                        className={`ml-1.5   text-xs px-1 rounded-full border ${venueFilter === s ? "bg-primary text-primary-foreground " : "bg-muted text-muted-foreground hover:bg-secondary border-muted-foreground"}`}
                                    >
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            {["Venue", "Owner", "Location", "Category", "Capacity", "Status", "Actions"].map(
                                (h) => (
                                    <TableHead
                                        key={h}
                                        className="px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider"
                                    >
                                        {h}
                                    </TableHead>
                                ),
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagedVenues.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            width={40}
                                            height={40}
                                            src={v.images[0] ?? ""}
                                            alt={v.name}
                                            className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0"
                                        />
                                        <div>
                                            <p className="font-semibold text-foreground">{v.name}</p>
                                            <p className="text-xs text-muted-foreground">{v.submitted}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-3.5 text-foreground/80">{v.owner}</TableCell>
                                <TableCell className="px-5 py-3.5 text-foreground/70">{v.location}</TableCell>
                                <TableCell className="px-5 py-3.5 text-foreground/70">{v.category}</TableCell>
                                <TableCell className="px-5 py-3.5 text-foreground/70">{v.capacity}</TableCell>
                                <TableCell className="px-5 py-3.5">
                                    <span
                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${VENUE_STATUS_STYLE[v.status]}`}
                                    >
                                        {v.status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3.5">
                                    <div className="flex items-center gap-1">
                                        {v.status === "Pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(v.id)}
                                                    disabled={loadingId === v.id}
                                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setRejectTarget(v.id)}
                                                    disabled={loadingId === v.id}
                                                    className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        {v.status === "Approved" && (
                                            <button
                                                onClick={() => suspendVenue(v.id)}
                                                className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                                                title="Suspend"
                                            >
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedVenue(v)}
                                            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-secondary transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredVenues.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <Building2 className="w-10 h-10 mx-auto mb-3 opacity-25" />
                        <p className="font-medium">No venues match your filter.</p>
                    </div>
                )}

                <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                        {Math.min(page * PAGE_SIZE, total)} of {total} venues
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
        </div>
        </>
    );
}
