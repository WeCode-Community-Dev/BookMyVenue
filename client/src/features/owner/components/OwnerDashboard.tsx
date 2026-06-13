// src/app/features/owner/components/OwnerDashboard.tsx
// OR use this as your page directly at: src/app/(owner)/dashboard/page.tsx
// If using as a page, rename to page.tsx and remove "use client" — wrap in a Client Component instead.

"use client";

import { useState, useMemo } from "react";
import { useVenues } from "../hooks/useVenues";
import StatsBar from "./StatsBar";
import VenueCard from "./VenueCard";
import CreateVenueModal from "./CreateVenueModal";
import EmptyVenues from "./EmptyVenues";
import "../owner-dashboard.css";

type FilterStatus = "all" | "active" | "inactive" | "pending";
type SortOption = "newest" | "oldest" | "name" | "price_asc" | "price_desc";

export default function OwnerDashboard() {
  const { venues, loading, error, submitting, stats, addVenue, removeVenue, toggleStatus } = useVenues();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...venues];

    if (filterStatus !== "all") {
      result = result.filter((v) => v.status === filterStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.category?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name": return a.name.localeCompare(b.name);
        case "price_asc": return a.price_per_hour - b.price_per_hour;
        case "price_desc": return b.price_per_hour - a.price_per_hour;
        default: return 0;
      }
    });

    return result;
  }, [venues, filterStatus, sortBy, search]);

  return (
    <div className="owner-dashboard">
      {/* Top header */}
      <div className="owner-dashboard-header">
        <div>
          <h1 className="owner-dashboard-title">My Venues</h1>
          <p className="owner-dashboard-subtitle">Manage and monitor all your listed spaces</p>
        </div>
        <button className="owner-btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Venue
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Toolbar */}
      <div className="owner-toolbar">
        <div className="owner-search-wrap">
          <svg className="owner-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="owner-search"
            type="text"
            placeholder="Search by name, city, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="owner-search-clear" onClick={() => setSearch("")}>×</button>
          )}
        </div>

        <div className="owner-filter-group">
          {(["all", "active", "pending", "inactive"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              className={`owner-filter-btn ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span className="filter-count">
                  {s === "active" ? stats.active : s === "pending" ? stats.pending : stats.inactive}
                </span>
              )}
            </button>
          ))}
        </div>

        <select
          className="owner-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="owner-loading">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="venue-card-skeleton">
              <div className="skeleton-stripe" />
              <div className="skeleton-header">
                <div className="skeleton-block w40 h40 rounded" />
                <div className="skeleton-block w80 h22 rounded-pill" />
              </div>
              <div className="skeleton-body">
                <div className="skeleton-block w70 h20 mb8" />
                <div className="skeleton-block w40 h14 mb14" />
                <div className="skeleton-block w100 h12 mb6" />
                <div className="skeleton-block w85 h12" />
              </div>
              <div className="skeleton-meta">
                <div className="skeleton-block w30 h14" />
                <div className="skeleton-block w30 h14" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="owner-error-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>{error}</p>
          <button className="owner-btn-secondary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : venues.length === 0 ? (
        <EmptyVenues onAdd={() => setModalOpen(true)} />
      ) : filtered.length === 0 ? (
        <div className="owner-no-results">
          <p>No venues match your filters.</p>
          <button className="owner-btn-secondary" onClick={() => { setSearch(""); setFilterStatus("all"); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="owner-venues-grid">
          {filtered.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onToggleStatus={toggleStatus}
              onDelete={removeVenue}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && !error && venues.length > 0 && (
        <p className="owner-results-count">
          Showing {filtered.length} of {venues.length} venue{venues.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Modal */}
      <CreateVenueModal
        open={modalOpen}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={addVenue}
      />
    </div>
  );
}