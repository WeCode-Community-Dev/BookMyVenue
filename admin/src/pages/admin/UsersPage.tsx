import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { BAN_SCOPES } from "@/constants/moderation";
import {
  useAdminUsers,
  useProfile,
  useToggleUserStatus,
  useChangePassword,
  useBanUser,
} from "@/services/api/useAdminUsers";
import type { User } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

// Extracted Components & Hooks
import {
  BanUserDialog,
  type BanDialogState,
} from "@/components/users/BanUserDialog";
import { ChangePasswordForm } from "@/components/users/ChangePasswordForm";
import { useUserColumns } from "@/components/users/useUserColumns";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [banDialog, setBanDialog] = useState<BanDialogState>({
    open: false,
    user: null,
    reason: "",
    scope: BAN_SCOPES.FULL,
  });

  const { openModal, closeModal } = useModal();
  const { success, error } = useToast();

  const { data, isLoading } = useAdminUsers(page);
  const { data: profile } = useProfile();

  const toggleStatusMutation = useToggleUserStatus();
  const changePasswordMutation = useChangePassword();
  const banUserMutation = useBanUser();

  const handleToggleStatus = (user: User) => {
    openModal({
      title: `${user.active ? "Suspend" : "Activate"} User`,
      size: "md",
      data: user,
      component: () => (
        <div className="p-4 text-center">
          <p className="mb-4">
            Are you sure you want to {user.active ? "suspend" : "activate"}{" "}
            <strong>{user.username}</strong>?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={toggleStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={user.active ? "destructive" : "default"}
              onClick={() => {
                toggleStatusMutation.mutate(
                  { userId: user._id },
                  {
                    onSuccess: () => {
                      success("User status updated");
                      closeModal();
                    },
                    onError: (err: unknown) => {
                      const axiosErr = err as import("axios").AxiosError<{
                        message: string;
                      }>;
                      error(
                        axiosErr.response?.data?.message ||
                          "Failed to update user status",
                      );
                    },
                  },
                );
              }}
              disabled={toggleStatusMutation.isPending}
            >
              {toggleStatusMutation.isPending ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      ),
      actions: [],
    });
  };

  const handleResetPassword = (user: User) => {
    if (profile && user._id === profile._id) {
      openModal({
        title: `Change My Password`,
        size: "md",
        data: user,
        component: () => (
          <ChangePasswordForm
            closeModal={closeModal}
            changePasswordMutation={changePasswordMutation}
          />
        ),
        actions: [],
      });
    }
  };

  const columns = useUserColumns({
    profile,
    handleToggleStatus,
    handleResetPassword,
    setBanDialog,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts, roles, and platform access.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.users ?? []}
        page={page}
        totalPages={data?.pagination?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No users found."
      />

      {banDialog.user && (
        <BanUserDialog
          banDialog={banDialog}
          setBanDialog={setBanDialog}
          banUserMutation={banUserMutation}
        />
      )}
    </div>
  );
}
