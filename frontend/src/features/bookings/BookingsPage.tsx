import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/api/bookings";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BookingStatusBadge } from "@/components/StatusBadges";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiErrorMessage } from "@/api/client";

export function BookingsPage() {
  const qc = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: bookingsApi.list,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => bookingsApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-bookings"] }),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Bookings</h1>

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
                    <p className="mt-2 text-sm">
                      Total:{" "}
                      <span className="font-semibold text-brand-600">
                        {formatCurrency(b.total_price)}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <BookingStatusBadge status={b.status} />
                    {(b.status === "pending" || b.status === "confirmed") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelMutation.mutate(b.id)}
                        disabled={cancelMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
                {cancelMutation.isError && cancelMutation.variables === b.id && (
                  <p className="mt-2 text-xs text-red-600">
                    {apiErrorMessage(cancelMutation.error)}
                  </p>
                )}
              </Card>
            ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no bookings yet.</p>
      )}
    </div>
  );
}
