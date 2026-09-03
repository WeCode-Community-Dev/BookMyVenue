import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Admin } from "@/types";

export function getAdminColumns(
  handleRevoke: (admin: Admin) => void,
  isPending: boolean,
) {
  return [
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
            disabled={isPending}
            onClick={() => handleRevoke(admin)}
          >
            Revoke Admin
          </Button>
        );
      },
    },
  ];
}
