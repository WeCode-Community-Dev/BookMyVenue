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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllVenues, useSetVenueStatus, useDeleteVenue } from "@/hooks/use-venue";
import type { AdminVenue } from "@/types/venue.types";
import { getAdminVenueColumns } from "./admin-venue-columns";

type StatusFilter = "ALL" | "PENDING" | "APPROVED";

const AdminVenues = () => {
  const { data: venues, isLoading } = useAllVenues();
  const setVenueStatus = useSetVenueStatus();
  const deleteVenue = useDeleteVenue();
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [venueToDelete, setVenueToDelete] = useState<AdminVenue | null>(null);

  const filteredVenues = useMemo(() => {
    if (!venues) return [];
    if (status === "PENDING") return venues.filter((venue) => !venue.isApproved);
    if (status === "APPROVED") return venues.filter((venue) => venue.isApproved);
    return venues;
  }, [venues, status]);

  const handleSetStatus = (venueId: string, isApproved: boolean) => {
    setVenueStatus.mutate(
      { venueId, isApproved },
      {
        onSuccess: () => toast.success(isApproved ? "Venue approved" : "Venue moved to pending"),
        onError: () => toast.error("Could not update venue status"),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!venueToDelete) return;
    deleteVenue.mutate(venueToDelete._id, {
      onSuccess: () => {
        toast.success("Venue deleted");
        setVenueToDelete(null);
      },
      onError: () => toast.error("Could not delete venue"),
    });
  };

  const columns = useMemo(
    () =>
      getAdminVenueColumns({
        onSetStatus: handleSetStatus,
        onDelete: setVenueToDelete,
        statusPendingId: setVenueStatus.isPending ? setVenueStatus.variables?.venueId : undefined,
        deletingId: deleteVenue.isPending ? deleteVenue.variables : undefined,
      }),
    [
      setVenueStatus.isPending,
      setVenueStatus.variables,
      deleteVenue.isPending,
      deleteVenue.variables,
    ],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Venues</h1>
          <p className="text-sm text-muted-foreground">
            Review and approve venues submitted by owners.
          </p>
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All venues</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredVenues}
          emptyMessage="No venues match this filter."
        />
      )}

      <Dialog
        open={Boolean(venueToDelete)}
        onOpenChange={(open) => !open && setVenueToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete venue</DialogTitle>
            <DialogDescription>
              This will permanently remove "{venueToDelete?.name}". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVenueToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteVenue.isPending}>
              {deleteVenue.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVenues;
