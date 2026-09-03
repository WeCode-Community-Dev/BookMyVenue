import { Unlock } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import type { BlockedDate } from "@/types/models";
import type { UseMutationResult } from "@tanstack/react-query";

export function BlockedDatesTable({
  tablePage,
  setTablePage,
  paginatedData,
  totalPages,
  isLoading,
  unblockMutation,
}: {
  tablePage: number;
  setTablePage: (page: number) => void;

  paginatedData: BlockedDate[];
  totalPages: number;
  isLoading: boolean;

  unblockMutation: UseMutationResult<
    unknown,
    unknown,
    { venueId: string; dates: string[] },
    unknown
  >;
}) {
  const columns: ColumnDef<BlockedDate>[] = [
    {
      accessorKey: "dateObj",
      header: "Date",
      cell: ({ row }) =>
        row.original.dateObj.toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      accessorKey: "isPast",
      header: "Status",
      cell: ({ row }) =>
        row.original.isPast ? (
          <Badge variant="secondary">Past</Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
            Upcoming
          </Badge>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          disabled={row.original.isPast || unblockMutation.isPending}
          onClick={() =>
            unblockMutation.mutate({
              venueId: row.original.venueId,
              dates: [row.original.date],
            })
          }
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Unlock className="h-4 w-4 mr-2" />
          Unblock
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-2">
      <DataTable
        columns={columns}
        data={paginatedData}
        page={tablePage}
        totalPages={totalPages}
        onPageChange={setTablePage}
        isLoading={isLoading}
        emptyMessage="No dates have been blocked yet."
      />
    </div>
  );
}
