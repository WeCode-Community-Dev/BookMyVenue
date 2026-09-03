import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { MIN_PASSWORD_LENGTH } from "@/constants/validation";
import type { UseMutationResult } from "@tanstack/react-query";

export function ChangePasswordForm({
  closeModal,
  changePasswordMutation,
}: {
  closeModal: () => void;

  changePasswordMutation: UseMutationResult<
    unknown,
    unknown,
    { oldPassword: string; newPassword: string },
    unknown
  >;
}) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { success, error } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      error("New passwords do not match");
      return;
    }
    if (newPass.length < MIN_PASSWORD_LENGTH) {
      error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    changePasswordMutation.mutate(
      {
        oldPassword: oldPass,
        newPassword: newPass,
      },
      {
        onSuccess: () => {
          success(
            "Password changed successfully. Please use your new password next time.",
          );
          closeModal();
        },
        onError: (err: unknown) => {
          const axiosErr = err as import("axios").AxiosError<{
            message: string;
          }>;
          error(
            axiosErr.response?.data?.message || "Failed to change password",
          );
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Old Password</label>
        <input
          type="password"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">New Password</label>
        <input
          type="password"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm New Password</label>
        <input
          type="password"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={changePasswordMutation.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={changePasswordMutation.isPending}>
          {changePasswordMutation.isPending ? "Saving..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}
