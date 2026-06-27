import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useVenueBookings } from "@/hooks/use-booking";
import { useMyVenues } from "@/hooks/use-venue";
import type { BookingStatus, VenueBooking } from "@/types/booking.types";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const timeFmt = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

const statusClass: Record<BookingStatus, string> = {
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  CANCELED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  REFUNDED: "bg-muted text-muted-foreground",
};

const columns: ColumnDef<VenueBooking>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => row.original.customer?.name ?? "—",
  },
  {
    accessorKey: "startTime",
    header: "Date",
    cell: ({ row }) => dateFmt.format(new Date(row.original.startTime)),
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) =>
      `${timeFmt.format(new Date(row.original.startTime))} - ${timeFmt.format(
        new Date(row.original.endTime),
      )}`,
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.totalAmount}`,
  },
  {
    accessorKey: "bookingStatus",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[row.original.bookingStatus]}`}>
        {row.original.bookingStatus}
      </span>
    ),
  },
];

const VenueBookings = () => {
  const { data: myVenues } = useMyVenues();

  const venueId = myVenues?.[0]?._id ?? "";
  const { data: bookings, isLoading } = useVenueBookings(venueId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Venue Bookings</h1>
        <p className="text-sm text-muted-foreground">Everyone who booked this venue.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-md" />
      ) : (
        <DataTable columns={columns} data={bookings ?? []} emptyMessage="No bookings yet." />
      )}
    </div>
  );
};

export default VenueBookings;
