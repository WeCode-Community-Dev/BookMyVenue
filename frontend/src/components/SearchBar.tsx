"use client";

import { useState } from "react";
import { VenueCategory, VENUE_CATEGORIES } from "@/lib/venues";

interface SearchBarProps {
  onSearch: (query: string, category: VenueCategory | "All") => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VenueCategory | "All">("All");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(query, category);
  }

  function handleQueryChange(val: string) {
    setQuery(val);
    onSearch(val, category);
  }

  function handleCategoryChange(val: VenueCategory | "All") {
    setCategory(val);
    onSearch(query, val);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {/* Search input */}
      <div style={{ position: "relative", flex: "1 1 240px" }}>
        <span
          style={{
            position: "absolute",
            left: "0.875rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          id="venue-search"
          type="text"
          className="input"
          placeholder="Search venues, locations…"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          style={{ paddingLeft: "2.5rem" }}
        />
      </div>

      {/* Category filter */}
      <select
        id="venue-category-filter"
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value as VenueCategory | "All")}
        style={{
          padding: "0.75rem 1rem",
          background: "var(--bg-elevated)",
          border: "1.5px solid var(--border-card)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-primary)",
          fontSize: "0.9375rem",
          cursor: "pointer",
          outline: "none",
          flex: "0 1 auto",
          minWidth: "160px",
          transition: "border-color 0.2s, box-shadow 0.2s",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1rem",
          paddingRight: "2.25rem",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-500)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.18)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border-card)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <option value="All">All Categories</option>
        {VENUE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </form>
  );
}
