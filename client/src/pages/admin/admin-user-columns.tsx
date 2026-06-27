import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, UserRole } from "@/types/auth.types";

const ROLES: UserRole[] = ["CUSTOMER", "OWNER", "ADMIN"];

interface ColumnOptions {
  currentUserId?: string;
  onChangeRole: (userId: string, role: UserRole) => void;
  onDelete: (user: User) => void;
  pendingUserId?: string;
}

export const getAdminUserColumns = ({
  currentUserId,
  onChangeRole,
  onDelete,
  pendingUserId,
}: ColumnOptions): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        {row.original._id === currentUserId && (
          <span className="text-xs text-muted-foreground">You</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const isSelf = row.original._id === currentUserId;
      return (
        <Select
          value={row.original.role}
          onValueChange={(value) => onChangeRole(row.original._id, value as UserRole)}
          disabled={isSelf || pendingUserId === row.original._id}>
          <SelectTrigger className="w-36" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "action",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const isSelf = row.original._id === currentUserId;
      return (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(row.original)}
            disabled={isSelf || pendingUserId === row.original._id}>
            Delete
          </Button>
        </div>
      );
    },
  },
];
