import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import ViewToggle from "./ViewToggle";
import { VenueCategory } from "@/constatnts/Venue";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const ratingOptions = [
  { label: "All Ratings", value: "" },
  { label: "4+ stars", value: 4 },
  { label: "3+ stars", value: 3 },
  { label: "2+ stars", value: 2 },
];

const VenueFilters = ({ filters, onChange, onAddVenue, onToggleView, viewMode }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-4">

      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <Input
          value={filters?.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          placeholder="Search venues..."
          className="pl-10"
        />
      </div>

      <select
        value={filters?.status || ""}
        onChange={(e) => onChange({ ...filters, status: e.target.value, page: 1 })}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters?.category || ""}
        onChange={(e) => onChange({ ...filters, category: e.target.value, page: 1 })}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
      >
        <option value="">All Categories</option>
        {VenueCategory.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={filters?.priceType || ""}
        onChange={(e) => onChange({ ...filters, priceType: e.target.value, page: 1 })}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
      >
        <option value="">Price Type</option>
        <option value="hour">Per Hour</option>
        <option value="day">Per Day</option>
      </select>

      <input
        type="number"
        value={filters?.minPrice ?? ""}
        onChange={(e) => onChange({ ...filters, minPrice: e.target.value, page: 1 })}
        placeholder="Min Price"
        className="h-10 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm"
      />

      <input
        type="number"
        value={filters?.maxPrice ?? ""}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value, page: 1 })}
        placeholder="Max Price"
        className="h-10 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm"
      />

      <select
        value={filters?.capacityType || ""}
        onChange={(e) => onChange({ ...filters, capacityType: e.target.value, page: 1 })}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
      >
        <option value="">Capacity Type</option>
        <option value="seating">Seating</option>
        <option value="standing">Standing</option>
      </select>

      <input
        type="number"
        value={filters?.capacity ?? ""}
        onChange={(e) => onChange({ ...filters, capacity: e.target.value, page: 1 })}
        placeholder="Capacity"
        className="h-10 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm"
      />

      <select
        value={filters?.rating ?? ""}
        onChange={(e) => onChange({ ...filters, rating: e.target.value, page: 1 })}
        className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
      >
        {ratingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ViewToggle viewMode={viewMode} onToggle={onToggleView} />

      <Button onClick={onAddVenue} className="bg-blue-600 hover:bg-blue-700 rounded-xl">
        <Plus className="mr-2 h-4 w-4" />
        Add Venue
      </Button>

    </div>
  );
};

export default VenueFilters;