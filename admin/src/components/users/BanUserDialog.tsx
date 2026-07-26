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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";
import { useToast } from "@/hooks/useToast";
import { BAN_SCOPES, BAN_DURATIONS, DAY_MS } from "@/constants/moderation";
import { MIN_REASON_LENGTH } from "@/constants/validation";
import type { UseMutationResult } from "@tanstack/react-query";

export type BanDialogState = {
  open: boolean;
  user: User | null;
  reason: string;
  scope: "full" | "commenting" | "owner_dashboard" | "venue_creation";
  venueId?: string | null;
  duration?: "permanent" | "1day" | "7days" | "30days" | "custom";
  customDate?: string;
};

export function BanUserDialog({
  banDialog,
  setBanDialog,
  banUserMutation,
}: {
  banDialog: BanDialogState;
  setBanDialog: (state: BanDialogState) => void;

  banUserMutation: UseMutationResult<
    unknown,
    unknown,
    {
      userId: string;
      scope: string;
      reason: string;
      venueId?: string | null;
      expiresAt?: string | null;
    },
    unknown
  >;
}) {
  const { success, error } = useToast();

  const handleBan = () => {
    if (banDialog.user && banDialog.reason.trim().length >= MIN_REASON_LENGTH) {
      let expiresAt: string | null = null;
      const now = new Date();
      switch (banDialog.duration) {
        case BAN_DURATIONS.ONE_DAY:
          expiresAt = new Date(now.getTime() + DAY_MS).toISOString();
          break;
        case BAN_DURATIONS.SEVEN_DAYS:
          expiresAt = new Date(now.getTime() + 7 * DAY_MS).toISOString();
          break;
        case BAN_DURATIONS.THIRTY_DAYS:
          expiresAt = new Date(now.getTime() + 30 * DAY_MS).toISOString();
          break;
        case BAN_DURATIONS.CUSTOM:
          expiresAt = banDialog.customDate
            ? new Date(banDialog.customDate).toISOString()
            : null;
          break;
      }
      banUserMutation.mutate(
        {
          userId: banDialog.user._id,
          scope: banDialog.scope,
          reason: banDialog.reason,
          venueId: banDialog.venueId,
          expiresAt,
        },
        {
          onSuccess: () => {
            success("User banned successfully");
            setBanDialog({
              open: false,
              user: null,
              reason: "",
              scope: BAN_SCOPES.FULL,
            });
          },

          onError: (err: unknown) => {
            const axiosErr = err as import("axios").AxiosError<{
              message: string;
            }>;
            error(axiosErr.response?.data?.message || "Failed to ban user");
          },
        },
      );
    }
  };

  return (
    <Dialog
      open={banDialog.open}
      onOpenChange={(open) => setBanDialog({ ...banDialog, open })}
    >
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Ban {banDialog.user?.username} from the platform. Select ban scope
            and provide a reason.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ban-scope">Ban Scope</Label>
            <Select
              value={banDialog.scope}
              onValueChange={(value) =>
                setBanDialog({
                  ...banDialog,

                  scope: value as BanDialogState["scope"],
                  venueId: undefined,
                })
              }
            >
              <SelectTrigger className="rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)]">
                <SelectValue placeholder="Select ban scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BAN_SCOPES.FULL}>
                  Full Platform Ban
                </SelectItem>
                <SelectItem value={BAN_SCOPES.COMMENTING}>
                  Commenting Ban
                </SelectItem>
                <SelectItem value={BAN_SCOPES.OWNER_DASHBOARD}>
                  Owner Dashboard Ban
                </SelectItem>
                <SelectItem value={BAN_SCOPES.VENUE_CREATION}>
                  Venue Creation Ban
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--text-secondary)]">
              {banDialog.scope === BAN_SCOPES.FULL &&
                "Blocks all access to the platform"}
              {banDialog.scope === BAN_SCOPES.COMMENTING &&
                "Blocks review/comment creation"}
              {banDialog.scope === BAN_SCOPES.OWNER_DASHBOARD &&
                "Blocks owner dashboard access"}
              {banDialog.scope === BAN_SCOPES.VENUE_CREATION &&
                "Blocks new venue creation"}
            </p>
          </div>

          {(banDialog.scope === BAN_SCOPES.COMMENTING ||
            banDialog.scope === BAN_SCOPES.OWNER_DASHBOARD) && (
            <div className="space-y-2">
              <Label htmlFor="ban-venue">Venue Scope (Optional)</Label>
              <Select
                value={banDialog.venueId || "all"}
                onValueChange={(value) =>
                  setBanDialog({
                    ...banDialog,
                    venueId: value === "all" ? null : value,
                  })
                }
              >
                <SelectTrigger className="rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)]">
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Venues (Global)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[var(--text-secondary)]">
                Leave as "All Venues" for a global ban, or select a specific
                venue for venue-scoped restriction
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ban-duration">Duration</Label>
            <Select
              value={banDialog.duration || BAN_DURATIONS.PERMANENT}
              onValueChange={(value) =>
                setBanDialog({
                  ...banDialog,

                  duration: value as BanDialogState["duration"],
                  customDate: undefined,
                })
              }
            >
              <SelectTrigger className="rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)]">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BAN_DURATIONS.PERMANENT}>
                  Permanent
                </SelectItem>
                <SelectItem value={BAN_DURATIONS.ONE_DAY}>1 Day</SelectItem>
                <SelectItem value={BAN_DURATIONS.SEVEN_DAYS}>7 Days</SelectItem>
                <SelectItem value={BAN_DURATIONS.THIRTY_DAYS}>
                  30 Days
                </SelectItem>
                <SelectItem value={BAN_DURATIONS.CUSTOM}>
                  Custom Date
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {banDialog.duration === BAN_DURATIONS.CUSTOM && (
            <div className="space-y-2">
              <Label htmlFor="ban-custom-date">Expiry Date</Label>
              <Input
                id="ban-custom-date"
                type="datetime-local"
                value={banDialog.customDate || ""}
                onChange={(e) =>
                  setBanDialog({ ...banDialog, customDate: e.target.value })
                }
                className="rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ban-reason">Ban Reason</Label>
            <Input
              id="ban-reason"
              placeholder="e.g., Violating terms of service, abusive behavior"
              value={banDialog.reason}
              onChange={(e) =>
                setBanDialog({ ...banDialog, reason: e.target.value })
              }
              minLength={MIN_REASON_LENGTH}
              className="rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
            />
            <p className="text-xs text-[var(--text-secondary)]">
              Minimum 10 characters required
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              setBanDialog({
                open: false,
                user: null,
                reason: "",
                scope: BAN_SCOPES.FULL,
              })
            }
            disabled={banUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBan}
            disabled={
              banUserMutation.isPending ||
              banDialog.reason.trim().length < MIN_REASON_LENGTH
            }
          >
            {banUserMutation.isPending ? "Banning..." : "Ban User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
