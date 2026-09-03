import { useState } from "react";
import { useApiQuery } from "@/hooks/useApi";
import { useModal } from "@/hooks/useModal";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { DataTable } from "@/components/ui/data-table";
import { useBookingColumns } from "@/components/bookings/useBookingColumns";
import type { Booking } from "@/types";

interface BookingsResponse {
  bookings: Booking[];
  pagination: { totalPages: number; currentPage: number };
}

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const { openModal } = useModal();

  const params = new URLSearchParams({ page: String(page), limit: "10" });

  const { data, isLoading } = useApiQuery<BookingsResponse>(
    [...QUERY_KEYS.ADMIN_BOOKINGS, page],
    { method: "GET", url: `${API_ENDPOINTS.ADMIN_BOOKINGS}?${params}` },
  );

  const columns = useBookingColumns({ openModal });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>
        <p className="text-muted-foreground mt-1">
          A global read-only view of every booking across all venues.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.bookings ?? []}
        page={page}
        totalPages={data?.pagination?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No bookings found."
      />
    </div>
  );
}
