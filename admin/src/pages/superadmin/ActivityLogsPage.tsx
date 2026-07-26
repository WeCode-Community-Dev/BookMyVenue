import { useState } from "react";
import { useApiQuery } from "@/hooks/useApi";
import { API_ENDPOINTS } from "@/constants";
import { ACTIVITY_LOGS_PAGE_LIMIT } from "@/constants/pagination";
import { QUERY_KEYS } from "@/config/queryKeys";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

interface Log {
  _id: string;
  adminId: {
    _id: string;
    username: string;
    email: string;
  };
  action: string;
  targetId: string;
  targetType: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface LogsResponse {
  logs: Log[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ACTION_COLORS: Record<
  string,
  "default" | "destructive" | "secondary" | "outline"
> = {
  ban_user: "destructive",
  unban_user: "default",
  suspend_venue: "destructive",
  unsuspend_venue: "default",
  remove_review: "secondary",
  restore_review: "outline",
};

const ACTION_LABELS: Record<string, string> = {
  ban_user: "Ban User",
  unban_user: "Unban User",
  suspend_venue: "Suspend Venue",
  unsuspend_venue: "Unsuspend Venue",
  remove_review: "Remove Review",
  restore_review: "Restore Review",
};

const ActivityLogsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useApiQuery<LogsResponse>(
    [...QUERY_KEYS.MODERATION_LOGS, page],
    {
      url: `${API_ENDPOINTS.MODERATION_LOGS}?page=${page}&limit=${ACTIVITY_LOGS_PAGE_LIMIT}`,
      method: "GET",
    },
  );

  const columns = [
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }: { row: { original: Log } }) => (
        <span className="whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "adminId",
      header: "Admin",
      cell: ({ row }: { row: { original: Log } }) => (
        <div>
          <p className="font-medium">
            {row.original.adminId?.username || "System"}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.adminId?.email || ""}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: { row: { original: Log } }) => (
        <Badge variant={ACTION_COLORS[row.original.action] || "outline"}>
          {ACTION_LABELS[row.original.action] || row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: "targetType",
      header: "Target Type",
      cell: ({ row }: { row: { original: Log } }) => (
        <span className="capitalize">{row.original.targetType}</span>
      ),
    },
    {
      accessorKey: "targetId",
      header: "Target ID",
      cell: ({ row }: { row: { original: Log } }) => (
        <span className="font-mono text-xs">{row.original.targetId}</span>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }: { row: { original: Log } }) => (
        <span className="text-sm">{row.original.reason || "-"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Moderation Logs
        </h1>
        <p className="text-muted-foreground mt-1">
          View all actions taken by administrators and moderators.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.logs ?? []}
        page={page}
        totalPages={data?.pagination?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No activity logs found."
      />
    </div>
  );
};

export default ActivityLogsPage;
