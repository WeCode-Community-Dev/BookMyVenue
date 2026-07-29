import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Search,
  Download,
  Filter,
} from "lucide-react";

const BookingFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  onExport,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center">

      {/* =========================
          SEARCH
      ========================= */}
      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings, customers, venues..."
          className="pl-10"
        />

      </div>


      {/* =========================
          STATUS FILTER
      ========================= */}
      <div className="flex h-10 items-center gap-2 rounded-lg border px-3">

        <Filter
          size={16}
          className="text-gray-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-transparent text-sm outline-none"
        >

          <option value="">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

      </div>


      {/* =========================
          EXPORT
      ========================= */}
      <Button
        type="button"
        variant="outline"
        onClick={onExport}
        className="gap-2"
      >

        <Download size={16} />

        Export

      </Button>

    </div>
  );
};

export default BookingFilters;