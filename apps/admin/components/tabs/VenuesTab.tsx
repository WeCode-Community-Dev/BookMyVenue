"use client";

import {
  Search, AlertTriangle, CheckCircle2, XCircle, Eye, Ban,
  Building2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { fmt, VENUE_STATUS_STYLE, VenueStatus, Venue } from "../data";

interface VenuesTabProps {
  venues: Venue[];
  filteredVenues: Venue[];
  venueSearch: string;
  setVenueSearch: (v: string) => void;
  venueFilter: VenueStatus | "All";
  setVenueFilter: (f: VenueStatus | "All") => void;
  approveVenue: (id: string) => void;
  rejectVenue: (id: string) => void;
  suspendVenue: (id: string) => void;
}

export function VenuesTab({
  venues, filteredVenues,
  venueSearch, setVenueSearch,
  venueFilter, setVenueFilter,
  approveVenue, rejectVenue, suspendVenue,
}: VenuesTabProps) {
  const pendingCount = venues.filter(v => v.status === "Pending").length;

  return (
    <div className="space-y-4">
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            <span className="font-bold">{pendingCount} venues</span> are awaiting your approval.
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search venues, owners, locations…"
              value={venueSearch}
              onChange={e => setVenueSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["All", "Active", "Pending", "Rejected", "Suspended"] as const).map(s => (
              <button
                key={s}
                onClick={() => setVenueFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${venueFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
              >
                {s}
                {s === "Pending" && pendingCount > 0 &&
                  <span className="ml-1.5 bg-accent text-white text-xs px-1 rounded-full">{pendingCount}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {["Venue", "Owner", "Location", "Category", "Capacity", "Price", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVenues.map(v => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={v.image} alt={v.name} className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.id} · {v.submitted}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-foreground/80 whitespace-nowrap">{v.owner}</td>
                  <td className="px-5 py-3.5 text-foreground/70 whitespace-nowrap">{v.location}</td>
                  <td className="px-5 py-3.5 text-foreground/70">{v.category}</td>
                  <td className="px-5 py-3.5 text-foreground/70">{v.capacity}</td>
                  <td className="px-5 py-3.5 font-semibold text-foreground whitespace-nowrap">{fmt(v.price)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${VENUE_STATUS_STYLE[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {v.status === "Pending" && (
                        <>
                          <button onClick={() => approveVenue(v.id)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => rejectVenue(v.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {v.status === "Active" && (
                        <button onClick={() => suspendVenue(v.id)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" title="Suspend">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-secondary transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVenues.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-25" />
              <p className="font-medium">No venues match your filter.</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredVenues.length} of {venues.length} venues</span>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
