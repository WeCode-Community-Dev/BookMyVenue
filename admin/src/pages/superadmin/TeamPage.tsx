import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";

import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Admin {
  [key: string]: unknown;
  _id: string;
  username: string;
  email: string;
  active: boolean;
  createdAt: string;
}

interface AdminsResponse {
  admins: Admin[];
  pagination: { totalPages: number; currentPage: number };
}

export default function TeamPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [page, setPage] = useState(1);

  const [promoteOpen, setPromoteOpen] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPER_ADMINS });

  const params = new URLSearchParams({
    page: String(page),
    limit: String(DEFAULT_PAGE_LIMIT),
  });

  const { data, isLoading } = useApiQuery<AdminsResponse>(
    [...QUERY_KEYS.SUPER_ADMINS, page],
    { method: "GET", url: `${API_ENDPOINTS.RBAC_ADMINS}?${params}` },
  );

  const promoteMutation = useApiMutation<unknown, { email: string }>(
    (vars) => ({
      method: "POST",
      url: API_ENDPOINTS.RBAC_PROMOTE,
      data: { email: vars.email },
    }),
    {
      onSuccess: () => {
        success("User promoted to admin");
        invalidate();
        setPromoteOpen(false);
        setPromoteEmail("");
      },
      onError: (e: Error) => {
        const err = e as import("axios").AxiosError<{ message: string }>;
        error(err.response?.data?.message ?? "Failed to promote user");
      },
    },
  );

  const demoteMutation = useApiMutation<unknown, { userId: string }>(
    (vars) => ({
      method: "POST",
      url: API_ENDPOINTS.RBAC_DEMOTE,
      data: { userId: vars.userId },
    }),
    {
      onSuccess: () => {
        success("Admin access revoked");
        invalidate();
      },
      onError: (e: Error) => {
        const err = e as import("axios").AxiosError<{ message: string }>;
        error(err.response?.data?.message ?? "Failed to revoke access");
      },
    },
  );

  // Handlers
  const handlePromote = () => {
    if (!promoteEmail.trim()) return error("Please enter an email address");
    promoteMutation.mutate({ email: promoteEmail.trim() });
  };

  const handleRevoke = (admin: Admin) => {
    if (!window.confirm(`Revoke admin access for "${admin.username}"?`)) return;
    demoteMutation.mutate({ userId: admin._id });
  };

  // Columns
  const columns = [
    {
      accessorKey: "username",
      header: "Name",
      cell: ({ row }: { row: { original: Admin } }) => (
        <span className="font-medium">{row.original.username}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: { original: Admin } }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }: { row: { original: Admin } }) => (
        <Badge variant={row.original.active ? "default" : "secondary"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Member Since",
      cell: ({ row }: { row: { original: Admin } }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: { original: Admin } }) => {
        const admin = row.original as Admin;
        return (
          <Button
            variant="destructive"
            size="sm"
            disabled={demoteMutation.isPending}
            onClick={() => handleRevoke(admin)}
          >
            Revoke Admin
          </Button>
        );
      },
    },
  ];

  // Render
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform administrators. Super Admin only.
          </p>
        </div>
        <Button onClick={() => setPromoteOpen(true)}>
          Promote User to Admin
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.admins ?? []}
        page={page}
        totalPages={data?.pagination?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No admins found."
      />

      {/* Promote Dialog */}
      <Dialog open={promoteOpen} onOpenChange={setPromoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote User to Admin</DialogTitle>
            <DialogDescription>
              Enter the email of an existing registered user to grant them
              administrator privileges.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="promote-email">User Email *</Label>
            <Input
              id="promote-email"
              type="email"
              value={promoteEmail}
              onChange={(e) => setPromoteEmail(e.target.value)}
              placeholder="user@example.com"
              onKeyDown={(e) => e.key === "Enter" && handlePromote()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPromoteOpen(false);
                setPromoteEmail("");
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!promoteEmail.trim() || promoteMutation.isPending}
              onClick={handlePromote}
            >
              {promoteMutation.isPending ? "Promoting…" : "Promote User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
