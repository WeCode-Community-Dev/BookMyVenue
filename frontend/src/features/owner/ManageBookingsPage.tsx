import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/api/bookings";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookingStatusBadge } from "@/components/StatusBadges";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiErrorMessage } from "@/api/client";

export function ManageBookingsPage() {
  const qc = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["owner-bookings"],
    queryFn: bookingsApi.ownerList,
  });

  const decide = useMutation({
    mutationFn: ({ id, accept }: { id: number; accept: boolean }) =>
      bookingsApi.ownerDecide(id, accept ? "confirmed" : "declined"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["owner-bookings"] }),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Incoming Bookings</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bookings && bookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bookings
            .slice()
            .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
            .map((b) => (
              <Card key={b.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{b.venue_name ?? `Venue #${b.venue_id}`}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(b.start_at)} → {formatDate(b.end_at)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-brand-600">
                      {formatCurrency(b.total_price)}
                    </p>
                  </div>
                  <BookingStatusBadge status={b.status} />
                </div>
                {b.status === "pending" && (
                  <div className="mt-4 flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => decide.mutate({ id: b.id, accept: true })}
                      disabled={decide.isPending}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => decide.mutate({ id: b.id, accept: false })}
                      disabled={decide.isPending}
                    >
                      Decline
                    </Button>
                  </div>
                )}
                {decide.isError && decide.variables?.id === b.id && (
                  <p className="mt-2 text-xs text-red-600">
                    {apiErrorMessage(decide.error)}
                  </p>
                )}
              </Card>
            ))}
        </div>
      ) : (
        <p className="text-gray-500">No bookings for your venues yet.</p>
      )}
    </div>
  );
}
