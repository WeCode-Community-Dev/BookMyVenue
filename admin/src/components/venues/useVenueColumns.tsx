import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Venue } from "@/types";
import type { ActiveModal } from "@/store/useModalStore";
import type { VenueDialogState } from "@/types/ui";
import type { UseMutationResult } from "@tanstack/react-query";
import { STATUS_VARIANT } from "@/constants/statusVariants";
import { VenueDetailPanel } from "@/components/common/panels/VenueDetailPanel";

export function useVenueColumns({
  openModal,
  closeModal,
  approveMutation,
  rejectMutation,
  featureMutation,
  suspendMutation,
  unsuspendMutation,
  setRejectDialog,
  setSuspendDialog,
  setFeatureDialog,
  setExtendDeadlineDialog,
  success,
  error,
}: {
  openModal: (opts: Omit<ActiveModal, "id">) => void;
  closeModal: () => void;
  approveMutation: UseMutationResult<unknown, unknown, { id: string }, unknown>;
  rejectMutation: UseMutationResult<
    unknown,
    unknown,
    { id: string; reason: string },
    unknown
  >;
  featureMutation: UseMutationResult<
    unknown,
    unknown,
    { id: string; durationDays: string },
    unknown
  >;
  suspendMutation: UseMutationResult<
    unknown,
    unknown,
    { id: string; suspensionReason: string },
    unknown
  >;
  unsuspendMutation: UseMutationResult<
    unknown,
    unknown,
    { id: string },
    unknown
  >;
  setRejectDialog: (state: VenueDialogState) => void;
  setSuspendDialog: (state: VenueDialogState) => void;
  setFeatureDialog: (state: VenueDialogState) => void;
  setExtendDeadlineDialog: (state: {
    open: boolean;
    venueId: string;
    currentDeadline: string;
  }) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
}) {
  return [
    {
      accessorKey: "name",
      header: "Venue",
      cell: ({ row }: { row: { original: Venue } }) => (
        <div
          className="cursor-pointer group"
          onClick={() => {
            openModal({
              title: row.original.name,
              size: "2xl",
              component: VenueDetailPanel,
              data: row.original,
              actions: [
                ...(row.original.status === "PendingReview"
                  ? [
                      {
                        label: "Approve",
                        variant: "default" as const,
                        onClick: () =>
                          approveMutation.mutate(
                            { id: row.original._id },
                            {
                              onSuccess: () => success("Venue approved"),

                              onError: (e: unknown) => {
                                const err = e as import("axios").AxiosError<{
                                  message: string;
                                }>;
                                error(
                                  err.response?.data?.message ??
                                    "Failed to approve",
                                );
                              },
                            },
                          ),
                        isLoading: approveMutation.isPending,
                      },
                      {
                        label: "Reject",
                        variant: "destructive" as const,
                        onClick: () => {
                          closeModal();
                          setRejectDialog({
                            open: true,
                            venueId: row.original._id,
                          });
                        },
                      },
                    ]
                  : []),
                ...(row.original.status === "Approved"
                  ? [
                      {
                        label: "Suspend",
                        variant: "destructive" as const,
                        onClick: () => {
                          closeModal();
                          setSuspendDialog({
                            open: true,
                            venueId: row.original._id,
                          });
                        },
                      },
                    ]
                  : []),
                ...(row.original.status === "Suspended"
                  ? [
                      {
                        label: "Unsuspend",
                        variant: "default" as const,
                        onClick: () =>
                          unsuspendMutation.mutate(
                            { id: row.original._id },
                            {
                              onSuccess: () => {
                                success("Venue unsuspended");
                                closeModal();
                              },

                              onError: (e: unknown) => {
                                const err = e as import("axios").AxiosError<{
                                  message: string;
                                }>;
                                error(
                                  err.response?.data?.message ??
                                    "Failed to unsuspend venue",
                                );
                              },
                            },
                          ),
                        isLoading: unsuspendMutation.isPending,
                      },
                    ]
                  : []),
              ],
            });
          }}
        >
          <p className="font-medium group-hover:text-primary transition-colors hover:underline">
            {row.original.name}
          </p>
          <p className="text-xs text-muted-foreground">{row.original.city}</p>
        </div>
      ),
    },
    {
      accessorKey: "venueType",
      header: "Type",
      cell: ({ row }: { row: { original: Venue } }) => (
        <span className="capitalize text-sm">{row.original.venueType}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Venue } }) => {
        const v = row.original as Venue;
        return (
          <Badge variant={STATUS_VARIANT[v.status] ?? "outline"}>
            {v.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }: { row: { original: Venue } }) => {
        const v = row.original as Venue;
        return (
          <Badge
            variant={v.isActive ? "default" : "outline"}
            className={
              v.isActive
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "text-muted-foreground"
            }
          >
            {v.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "ownerUserId",
      header: "Owner",
      cell: ({ row }: { row: { original: Venue } }) => (
        <span>{row.original.ownerUserId?.username || "—"}</span>
      ),
    },
    {
      accessorKey: "avgRating",
      header: "Rating",
      cell: ({ row }: { row: { original: Venue } }) => {
        const r = row.original;
        return (
          <span>
            {r.avgRating != null
              ? `${r.avgRating.toFixed(1)} (${r.reviewCount ?? 0})`
              : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }: { row: { original: Venue } }) =>
        row.original.updatedAt
          ? new Date(row.original.updatedAt).toLocaleDateString()
          : "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: { original: Venue } }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: { original: Venue } }) => {
        const venue = row.original as Venue;
        const isBusy =
          approveMutation.isPending ||
          rejectMutation.isPending ||
          featureMutation.isPending ||
          suspendMutation.isPending ||
          unsuspendMutation.isPending;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isBusy}>
                <span className="sr-only">Open actions</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {venue.status === "PendingReview" && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      approveMutation.mutate(
                        { id: venue._id },
                        {
                          onSuccess: () => success("Venue approved"),

                          onError: (e: unknown) => {
                            const err = e as import("axios").AxiosError<{
                              message: string;
                            }>;
                            error(
                              err.response?.data?.message ??
                                "Failed to approve",
                            );
                          },
                        },
                      )
                    }
                  >
                    ✓ Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() =>
                      setRejectDialog({ open: true, venueId: venue._id })
                    }
                  >
                    ✕ Reject…
                  </DropdownMenuItem>
                </>
              )}

              {venue.status === "Approved" && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      setFeatureDialog({ open: true, venueId: venue._id })
                    }
                  >
                    ★ Feature Venue…
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-amber-600 focus:text-amber-600"
                    onClick={() =>
                      setSuspendDialog({ open: true, venueId: venue._id })
                    }
                  >
                    ⏸ Suspend…
                  </DropdownMenuItem>
                </>
              )}

              {venue.status === "Suspended" && (
                <DropdownMenuItem
                  onClick={() =>
                    unsuspendMutation.mutate(
                      { id: venue._id },
                      {
                        onSuccess: () => {
                          success("Venue unsuspended");
                          closeModal();
                        },
                        onError: (e: unknown) => {
                          const err = e as import("axios").AxiosError<{
                            message: string;
                          }>;
                          error(
                            err.response?.data?.message ??
                              "Failed to unsuspend venue",
                          );
                        },
                      },
                    )
                  }
                >
                  ✓ Unsuspend
                </DropdownMenuItem>
              )}

              {venue.status === "Rejected" &&
                venue.currentEditDeadline &&
                (() => {
                  const deadline = venue.currentEditDeadline;
                  return (
                    <DropdownMenuItem
                      onClick={() =>
                        setExtendDeadlineDialog({
                          open: true,
                          venueId: venue._id,
                          currentDeadline: deadline,
                        })
                      }
                    >
                      ⏰ Extend Deadline…
                    </DropdownMenuItem>
                  );
                })()}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
