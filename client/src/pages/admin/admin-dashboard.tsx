import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllVenues, useSetVenueStatus } from "@/hooks/use-venue";
import { VENUE_TYPE_LABELS } from "@/types/venue.types";

const AdminDashboard = () => {
  const { data: venues, isLoading } = useAllVenues();
  const setVenueStatus = useSetVenueStatus();

  const total = venues?.length ?? 0;
  const pending = venues?.filter((venue) => !venue.isApproved).length ?? 0;
  const approved = total - pending;

  const handleApprove = (venueId: string) => {
    setVenueStatus.mutate(
      { venueId, isApproved: true },
      {
        onSuccess: () => toast.success("Venue approved"),
        onError: () => toast.error("Could not approve venue"),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve venues submitted by owners.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col gap-1 py-5">
            <span className="text-sm text-muted-foreground">Pending approval</span>
            <span className="text-2xl font-semibold text-amber-600">{pending}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1 py-5">
            <span className="text-sm text-muted-foreground">Approved</span>
            <span className="text-2xl font-semibold text-green-600">{approved}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1 py-5">
            <span className="text-sm text-muted-foreground">Total venues</span>
            <span className="text-2xl font-semibold">{total}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col gap-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !venues || venues.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No venues have been submitted yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/hr</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <TableRow key={venue._id}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{venue.owner?.name ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">
                          {venue.owner?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{venue.city ?? "—"}</TableCell>
                    <TableCell>{VENUE_TYPE_LABELS[venue.venueType]}</TableCell>
                    <TableCell>₹{venue.pricePerHour}</TableCell>
                    <TableCell>
                      <span
                        className={
                          venue.isApproved
                            ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                        }>
                        {venue.isApproved ? "Approved" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {venue.isApproved ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(venue._id)}
                          disabled={
                            setVenueStatus.isPending &&
                            setVenueStatus.variables?.venueId === venue._id
                          }>
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
