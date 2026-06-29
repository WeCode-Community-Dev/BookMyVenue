"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/src/admin/components/StatusBadge";
import { EmptyState } from "@/src/admin/components/EmptyState";
import { Pagination } from "@/src/admin/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPendingVenues } from "@/src/admin/route";

const PAGE_SIZE = 10;

interface PendingVenue {
  id: string;
  venueName: string;
  venueType: string;
  city: string;
  district: string;
  state: string;
  status: string;
  createdAt?: string;
  stepDocumentsDone?: boolean;
  stepPhotosDone?: boolean;
}

export default function VerificationPage() {
  const [venues, setVenues] = useState<PendingVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingVenues();
      setVenues(data as PendingVenue[]);
    } catch (e: any) {
      setError(e.message ?? "Failed to load pending venues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const venueTypes = useMemo(() => {
    const types = new Set(venues.map((v) => v.venueType));
    return ["ALL", ...Array.from(types)];
  }, [venues]);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      const matchSearch =
        !search ||
        v.venueName.toLowerCase().includes(search.toLowerCase()) ||
        v.city.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "ALL" || v.venueType === typeFilter;
      return matchSearch && matchType;
    });
  }, [venues, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-5 animate-staggered-entrance">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A19]">Venue Verification</h1>
          <p className="text-xs text-[#70706e] mt-0.5">
            {loading ? "Loading..." : `${filtered.length} venue(s) awaiting review`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchVenues}
          disabled={loading}
          className="border-[#E2E2DE] text-[#70706e] hover:bg-[#F0F0EC] rounded-xl gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Filters row ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#70706e]" />
          <Input
            placeholder="Search by venue or city…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 rounded-xl border-[#E2E2DE] bg-white text-sm h-9"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-[#70706e] shrink-0" />
          {venueTypes.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setPage(1);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                typeFilter === t
                  ? "bg-[#0D7377] text-white"
                  : "bg-[#F0F0EC] text-[#70706e] hover:bg-[#E2E2DE]"
              }`}
            >
              {t === "ALL" ? "All Types" : t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table / Cards ── */}
      <div className="bg-white rounded-2xl border border-[#E2E2DE] shadow-xs overflow-hidden">
        {loading ? (
          <div className="divide-y divide-[#E2E2DE]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="h-6 w-6" />}
            title={search || typeFilter !== "ALL" ? "No matching venues" : "No pending verifications"}
            description={
              search || typeFilter !== "ALL"
                ? "Try clearing your filters."
                : "All venue submissions are up to date."
            }
            className="py-16"
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F0F0EC] border-b border-[#E2E2DE] text-[#70706e] font-bold uppercase text-[10px] tracking-wide">
                    <th className="px-5 py-3">Venue</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Submitted</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2DE]">
                  {paginated.map((venue) => (
                    <tr
                      key={venue.id}
                      className="hover:bg-[#FAFAF8] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                            <Building2 className="h-4.5 w-4.5 text-amber-500" />
                          </div>
                          <span className="font-semibold text-[#1A1A19] text-sm max-w-[180px] truncate">
                            {venue.venueName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#70706e]">
                        {venue.venueType ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-[#70706e]">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {venue.city ?? venue.district}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#70706e]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          {formatDate(venue.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={venue.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/admin/verification/${venue.id}`}>
                          <Button
                            size="sm"
                            className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white rounded-lg text-[11px] h-7 px-3 gap-1"
                          >
                            Review
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#E2E2DE]">
              {paginated.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/admin/verification/${venue.id}`}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-[#FAFAF8] transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1A19] text-sm truncate">
                      {venue.venueName}
                    </p>
                    <p className="text-[11px] text-[#70706e] mt-0.5">
                      {venue.venueType} · {venue.city}
                    </p>
                    <div className="mt-1.5">
                      <StatusBadge status={venue.status} />
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
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="pt-2"
        />
      )}
    </div>
  );
}
