"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Search,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/src/admin/components/StatusBadge";
import { EmptyState } from "@/src/admin/components/EmptyState";
import { Pagination } from "@/src/admin/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminVenues } from "@/src/admin/route";

const PAGE_SIZE = 10;

const STATUS_FILTERS = ["ALL", "APPROVED", "PENDING_REVIEW", "RESUBMITTED", "REJECTED", "DRAFT"];

interface VenueItem {
  id: string;
  venueName: string;
  venueType: string;
  city: string;
  status: string;
  startingPrice?: number;
  maxCapacity?: number;
}

export default function ManageVenuesPage() {
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminVenues();
      setVenues(data as VenueItem[]);
    } catch {
      setError("Failed to load venues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const allVenues = venues;

  const filtered = useMemo(() => {
    return allVenues.filter((v) => {
      const q = search.toLowerCase();
      const matchSearch = !q || v.venueName.toLowerCase().includes(q) || v.city.toLowerCase().includes(q);
      const matchStatus = statusFilter === "ALL" || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allVenues, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusIcon = (status: string) => {
    if (status === "APPROVED") return <CheckCircle className="h-3 w-3 text-emerald-600" />;
    if (status === "PENDING_REVIEW" || status === "RESUBMITTED") return <Clock className="h-3 w-3 text-amber-500" />;
    if (status === "REJECTED") return <XCircle className="h-3 w-3 text-red-500" />;
    return null;
  };

  const approvedCount = allVenues.filter((v) => v.status === "APPROVED").length;
  const pendingCount = allVenues.filter((v) => v.status === "PENDING_REVIEW" || v.status === "RESUBMITTED").length;
  const rejectedCount = allVenues.filter((v) => v.status === "REJECTED").length;

  return (
    <div className="space-y-5 animate-staggered-entrance">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A19]">Manage Venues</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {approvedCount} Approved
            </span>
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {pendingCount} Pending
            </span>
            <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {rejectedCount} Rejected
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}
            className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#70706e]" />
          <Input placeholder="Search by venue name or city…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 rounded-xl border-[#E2E2DE] bg-white text-sm h-9" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-[#70706e] shrink-0" />
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === s ? "bg-[#0D7377] text-white" : "bg-[#F0F0EC] text-[#70706e] hover:bg-[#E2E2DE]"
              }`}>
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
        {loading ? (
          <div className="divide-y divide-[#E2E2DE]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-6 w-6" />}
            title="No venues found"
            description="Try clearing your search or filter."
            className="py-16"
          />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F0F0EC] border-b border-[#E2E2DE] text-[#70706e] font-bold uppercase text-[10px] tracking-wide">
                    <th className="px-5 py-3">Venue</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Capacity</th>
                    <th className="px-5 py-3">Starting Price</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2DE]">
                  {paginated.map((venue) => (
                    <tr key={venue.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-[#E6F1F1] flex items-center justify-center shrink-0">
                            <Building2 className="h-4.5 w-4.5 text-[#0D7377]" />
                          </div>
                          <span className="font-semibold text-[#1A1A19] text-sm max-w-[160px] truncate">
                            {venue.venueName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#70706e]">{venue.venueType ?? "—"}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-[#70706e]">
                          <MapPin className="h-3 w-3 shrink-0" />{venue.city}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#70706e]">
                        {venue.maxCapacity ? venue.maxCapacity.toLocaleString() : "—"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#0D7377]">
                        {venue.startingPrice
                          ? `₹${venue.startingPrice.toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={venue.status} /></td>
                      <td className="px-5 py-4 text-right">
                        <Link href={
                          venue.status === "PENDING_REVIEW" || venue.status === "RESUBMITTED"
                            ? `/admin/verification/${venue.id}`
                            : `/admin/venues/${venue.id}`
                        }>
                          <Button size="sm" className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white rounded-lg text-[11px] h-7 px-3 gap-1">
                            {venue.status === "PENDING_REVIEW" || venue.status === "RESUBMITTED" ? "Review" : "View"}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#E2E2DE]">
              {paginated.map((venue) => (
                <Link key={venue.id} href={`/admin/venues/${venue.id}`}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-[#FAFAF8] transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-[#E6F1F1] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="h-5 w-5 text-[#0D7377]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1A19] text-sm">{venue.venueName}</p>
                    <p className="text-[11px] text-[#70706e]">{venue.venueType} · {venue.city}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <StatusBadge status={venue.status} />
                      {venue.startingPrice && (
                        <span className="text-[10px] font-semibold text-[#0D7377]">
                          ₹{venue.startingPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#70706e] shrink-0 mt-3" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="pt-2" />
      )}
    </div>
  );
}
