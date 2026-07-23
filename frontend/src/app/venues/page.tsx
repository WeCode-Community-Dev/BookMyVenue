"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import SearchBar from "@/components/SearchBar";
import VenueCard from "@/components/VenueCard";
import { fetchVenues } from "@/lib/venues";
import type { VenueCategory, Venue } from "@/lib/venues";

function VenueSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <div className="skeleton" style={{ height: "200px" }} />
      <div style={{ padding: "1.125rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        <div className="skeleton" style={{ height: "20px", width: "70%" }} />
        <div className="skeleton" style={{ height: "14px", width: "50%" }} />
        <div className="skeleton" style={{ height: "14px", width: "40%" }} />
        <div className="skeleton" style={{ height: "36px", marginTop: "0.5rem" }} />
      </div>
    </div>
  );
}

function VenuesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<VenueCategory | "All">("All");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchVenues({ search: searchQuery, category })
      .then(setVenues)
      .finally(() => setLoading(false));
  }, [searchQuery, category]);

  function handleSearch(q: string, cat: VenueCategory | "All") {
    setSearchQuery(q);
    setCategory(cat);
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "0 1.5rem" }}>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Discover Venues
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem" }}>
          Find the perfect space for your next event
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Results info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          {venues.length === 0
            ? "No venues found"
            : `${venues.length} venue${venues.length === 1 ? "" : "s"} found`}
          {category !== "All" && (
            <span style={{ color: "var(--accent-400)", marginLeft: "0.35rem" }}>
              in {category}
            </span>
          )}
        </p>
        {(searchQuery || category !== "All") && (
          <button
            className="btn btn-ghost"
            onClick={() => handleSearch("", "All")}
            style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem" }}
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <VenueSkeleton key={i} />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            No venues found
          </h3>
          <p>Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {venues.map((venue, i) => (
            <div
              key={venue.id}
              style={{
                animation: `fadeInUp ${0.1 + i * 0.05}s ease forwards`,
                opacity: 0,
              }}
            >
              <VenueCard venue={venue} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VenuesPage() {
  return (
    <AuthGuard>
      <div style={{ padding: "2.5rem 0 4rem" }}>
        <VenuesContent />
      </div>
    </AuthGuard>
  );
}
