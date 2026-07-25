import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";

const BookingFilters = () => {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
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
      <div className="flex h-10 items-center gap-2 rounded-lg border px-3">
        <Filter
          size={16}
          className="text-gray-500"
        />

        <select
          className="bg-transparent text-sm outline-none"
          defaultValue="all"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Export */}
      <Button
        type="button"
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