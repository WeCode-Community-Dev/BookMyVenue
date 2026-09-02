import { useState } from "react";
import { useApiQuery } from "@/hooks/useApi";
import { API_ENDPOINTS } from "@/constants";
import { ACTIVITY_LOGS_PAGE_LIMIT } from "@/constants/pagination";
import { QUERY_KEYS } from "@/config/queryKeys";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

interface Log {
  _id: string;
  actorId?: {
    _id: string;
    username: string;
    email: string;
  } | null;
  actorRole: "superAdmin" | "admin" | "owner" | "system";
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
  approve_venue: "default",
  reject_venue: "destructive",
  auto_suspend_venue: "destructive",
  extend_venue_deadline: "outline",
  request_inactivity: "secondary",
  cancel_inactivity: "outline",
  approve_inactivity: "secondary",
  reject_inactivity: "destructive",
  venue_closed: "destructive",
  reopen_venue: "default",
  request_venue_deletion: "destructive",
};

const ACTION_LABELS: Record<string, string> = {
  ban_user: "Ban User",
  unban_user: "Unban User",
  suspend_venue: "Suspend Venue",
  unsuspend_venue: "Unsuspend Venue",
  remove_review: "Remove Review",
  restore_review: "Restore Review",
  approve_venue: "Approve Venue",
  reject_venue: "Reject Venue",
  auto_suspend_venue: "Auto-suspend Venue",
  extend_venue_deadline: "Extend Deadline",
  request_inactivity: "Closure Requested",
  cancel_inactivity: "Closure Cancelled",
  approve_inactivity: "Closure Approved",
  reject_inactivity: "Closure Rejected",
  venue_closed: "Venue Closed",
  reopen_venue: "Venue Reopened",
  request_venue_deletion: "Deletion Requested",
};

const ROLE_LABELS: Record<string, string> = {
  superAdmin: "Super Admin",
  admin: "Admin",
  owner: "Owner",
  system: "System",
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
      accessorKey: "actorId",
      header: "Actor",
      cell: ({ row }: { row: { original: Log } }) => (
        <div>
          <p className="font-medium">
            {row.original.actorId?.username ?? "System"}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.actorId?.email ??
              ROLE_LABELS[row.original.actorRole] ??
              ""}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "actorRole",
      header: "Role",
      cell: ({ row }: { row: { original: Log } }) => (
        <Badge variant="outline">
          {ROLE_LABELS[row.original.actorRole] ?? row.original.actorRole}
        </Badge>
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
