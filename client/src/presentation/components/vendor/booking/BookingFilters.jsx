import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";

const BookingFilters = () => {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm flex items-center gap-4 mb-6">

      {/* Search */}
      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <Input
          placeholder="Search bookings, customers, venues..."
          className="pl-10"
        />

      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 border rounded-lg px-3 h-10">

        <Filter
          size={16}
          className="text-gray-500"
        />

        <select className="outline-none bg-transparent text-sm">
          <option>All Status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

      </div>

      {/* Export */}
      <Button
        variant="outline"
        className="gap-2"
      >
        <Download size={16} />
        Export
      </Button>

    </div>
  );
};

export default BookingFilters;