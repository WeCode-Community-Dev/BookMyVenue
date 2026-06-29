import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import ViewToggle from "./ViewToggle";

const VenueFilters = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">

      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <Input
          placeholder="Search venues..."
          className="pl-10"
        />
      </div>

      {/* Status */}
      <select className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
        <option>All Status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>

      {/* Category */}
      <select className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm">
        <option>All Categories</option>
        <option>Banquet Hall</option>
        <option>Outdoor Venue</option>
        <option>Conference Hall</option>
      </select>

      {/* Grid/List Toggle */}
      <ViewToggle />

      {/* Add Venue */}
      <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
        <Plus className="mr-2 h-4 w-4" />
        Add Venue
      </Button>

    </div>
  );
};

export default VenueFilters;