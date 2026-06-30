import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VenueStatusBadge } from "@/components/StatusBadges";
import { venueTypeLabel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { apiErrorMessage } from "@/api/client";

export function AdminApprovalsPage() {
  const qc = useQueryClient();
  const { data: pending, isLoading } = useQuery({
    queryKey: ["admin-pending"],
    queryFn: adminApi.pendingVenues,
  });

  const approve = useMutation({
    mutationFn: (id: number) => adminApi.setVenueStatus(id, "approved"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pending"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  const reject = useMutation({
    mutationFn: (id: number) => adminApi.setVenueStatus(id, "rejected"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pending"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Pending Venue Approvals</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : pending && pending.length > 0 ? (
        <div className="flex flex-col gap-4">
          {pending.map((v) => (
            <Card key={v.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{v.name}</h3>
                    <VenueStatusBadge status={v.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {venueTypeLabel(v.type)} · {v.address} · Cap {v.capacity}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-600">
                    {formatCurrency(v.price_per_hour)}/hr
                  </p>
                  {v.description && (
                    <p className="mt-2 text-sm text-gray-600">{v.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  size="sm"
                  onClick={() => approve.mutate(v.id)}
                  disabled={approve.isPending || reject.isPending}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reject.mutate(v.id)}
                  disabled={approve.isPending || reject.isPending}
                >
                  Reject
                </Button>
              </div>
              {(approve.isError || reject.isError) && (
                <p className="mt-2 text-xs text-red-600">
                  {apiErrorMessage(approve.error ?? reject.error)}
                </p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-gray-500">
          No venues pending approval.
        </Card>
      )}
    </div>
  );
}
