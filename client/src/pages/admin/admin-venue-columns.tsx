import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { VENUE_TYPE_LABELS, type AdminVenue } from "@/types/venue.types";

interface ColumnOptions {
  onSetStatus: (venueId: string, isApproved: boolean) => void;
  onDelete: (venue: AdminVenue) => void;
  statusPendingId?: string;
  deletingId?: string;
}

export const getAdminVenueColumns = ({
  onSetStatus,
  onDelete,
  statusPendingId,
  deletingId,
}: ColumnOptions): ColumnDef<AdminVenue>[] => [
  {
    accessorKey: "name",
    header: "Venue",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.owner?.name ?? "—"}</span>
        <span className="text-xs text-muted-foreground">{row.original.owner?.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => row.original.city ?? "—",
  },
  {
    accessorKey: "venueType",
    header: "Type",
    cell: ({ row }) => VENUE_TYPE_LABELS[row.original.venueType],
  },
  {
    accessorKey: "pricePerHour",
    header: "Price/hr",
    cell: ({ row }) => `₹${row.original.pricePerHour}`,
  },
  {
    accessorKey: "isApproved",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={
          row.original.isApproved
            ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400"
            : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
        }>
        {row.original.isApproved ? "Approved" : "Pending"}
      </span>
    ),
  },
  {
    id: "action",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        {row.original.isApproved ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetStatus(row.original._id, false)}
            disabled={statusPendingId === row.original._id}>
            Revoke
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onSetStatus(row.original._id, true)}
            disabled={statusPendingId === row.original._id}>
            Approve
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(row.original)}
          disabled={deletingId === row.original._id}>
          Delete
        </Button>
      </div>
    ),
  },
];
