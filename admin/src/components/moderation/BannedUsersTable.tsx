import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ModerationSummary } from "@/types";
import type { UseMutationResult } from "@tanstack/react-query";

export function BannedUsersTable({
  bannedUsers,
  unbanUserMutation,
}: {
  bannedUsers: ModerationSummary["bannedUsers"];

  unbanUserMutation: UseMutationResult<
    unknown,
    unknown,
    { userId: string },
    unknown
  >;
}) {
  const columns = [
    {
      accessorKey: "username",
      header: "User",
      cell: ({
        row,
      }: {
        row: { original: ModerationSummary["bannedUsers"][0] };
      }) => (
        <div>
          <p className="font-bold text-[var(--text-primary)]">
            {row.original.username}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {row.original.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "banReason",
      header: "Ban Reason",
      cell: ({
        row,
      }: {
        row: { original: ModerationSummary["bannedUsers"][0] };
      }) => (
        <p
          className="text-sm text-[var(--text-secondary)] max-w-xs truncate cursor-help"
          title={row.original.banReason}
        >
          {row.original.banReason}
        </p>
      ),
    },
    {
      accessorKey: "bannedAt",
      header: "Banned On",
      cell: ({
        row,
      }: {
        row: { original: ModerationSummary["bannedUsers"][0] };
      }) => (
        <p className="text-sm text-[var(--text-secondary)]">
          {new Date(row.original.bannedAt).toLocaleDateString()}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-300 dark:bg-red-950"
        >
          Banned
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({
        row,
      }: {
        row: { original: ModerationSummary["bannedUsers"][0] };
      }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  unbanUserMutation.mutate({ userId: row.original.userId })
                }
                disabled={unbanUserMutation.isPending}
              >
                <RotateCcw size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Unban</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={bannedUsers}
      page={1}
      totalPages={1}
      onPageChange={() => {}}
      emptyMessage="No banned users."
    />
  );
}
