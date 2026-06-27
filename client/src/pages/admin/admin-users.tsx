import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteUser, useUpdateUserRole, useUsers } from "@/hooks/use-user";
import { useAuthStore } from "@/store/store";
import type { User, UserRole } from "@/types/auth.types";
import { getAdminUserColumns } from "./admin-user-columns";

const AdminUsers = () => {
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const currentUser = useAuthStore((state) => state.user);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleChangeRole = (userId: string, role: UserRole) => {
    updateRole.mutate(
      { userId, role },
      {
        onSuccess: () => toast.success("Role updated"),
        onError: () => toast.error("Could not update role"),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete._id, {
      onSuccess: () => {
        toast.success("User deleted");
        setUserToDelete(null);
      },
      onError: () => toast.error("Could not delete user"),
    });
  };

  const columns = useMemo(
    () =>
      getAdminUserColumns({
        currentUserId: currentUser?._id,
        onChangeRole: handleChangeRole,
        onDelete: setUserToDelete,
        pendingUserId: updateRole.isPending ? updateRole.variables?.userId : undefined,
      }),
    [currentUser?._id, updateRole.isPending, updateRole.variables],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform users, change roles, or remove accounts.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={users ?? []} emptyMessage="No users found." />
      )}

      <Dialog open={Boolean(userToDelete)} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              This will permanently remove {userToDelete?.name}'s account. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteUser.isPending}>
              {deleteUser.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
