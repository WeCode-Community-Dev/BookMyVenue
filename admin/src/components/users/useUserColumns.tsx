import { ShieldAlert, ShieldCheck, KeyRound, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/constants/roles";
import type { User } from "@/types";
import type { UserProfile } from "@/components/guards/AuthGuard";
import type { BanDialogState } from "./BanUserDialog";

export function useUserColumns({
  profile,
  handleToggleStatus,
  handleResetPassword,
  setBanDialog,
}: {
  profile?: UserProfile | null;
  handleToggleStatus: (user: User) => void;
  handleResetPassword: (user: User) => void;
  setBanDialog: (opts: BanDialogState) => void;
}) {
  return [
    {
      accessorKey: "username",
      header: "Name",
      cell: ({ row }: { row: { original: User } }) => (
        <span className="font-medium text-zinc-900">
          {row.original.username}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }: { row: { original: User } }) => {
        const roles = (row.original.roles as string[]) || [];
        return (
          <div className="flex gap-1 flex-wrap">
            {roles.map((role: string) => (
              <Badge
                key={role}
                variant={role === ROLES.SUPER_ADMIN ? "default" : "secondary"}
                className="capitalize"
              >
                {role}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: User } }) => (
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={row.original.status === "active" ? "default" : "secondary"}
          >
            {row.original.status === "active" ? "Active" : "Suspended"}
          </Badge>
          {row.original.status === "banned" && (
            <Badge variant="destructive" className="bg-red-600/20 text-red-600">
              Banned
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }: { row: { original: User } }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: User } }) => {
        const isSelf = profile && row.original._id === profile._id;

        return (
          <div className="flex items-center gap-2">
            {!isSelf && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setBanDialog({
                    open: true,
                    user: row.original,
                    reason: "",
                    scope: "full",
                  })
                }
                title="Ban User"
              >
                <Ban className="w-4 h-4 text-red-500" />
              </Button>
            )}
            {!isSelf && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(row.original)}
                title={row.original.active ? "Suspend User" : "Activate User"}
              >
                {row.original.active ? (
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResetPassword(row.original)}
              title="Reset Password"
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
            </Button>
          </div>
        );
      },
    },
  ];
}
