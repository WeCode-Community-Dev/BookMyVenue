import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listHostVenues, deleteVenue } from "@/server-adapters/venues.functions";
import { formatMoney, formatAddress } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/host/venues/")({
  component: HostVenuesPage,
});

function HostVenuesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listHostVenues);
  const delFn = useServerFn(deleteVenue);
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ["host-venues"],
    queryFn: () => listFn({}),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Venue deleted");
      qc.invalidateQueries({ queryKey: ["host-venues"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-center text-lead/50 py-12">Loading…</p>;

  if (venues.length === 0) {
    return (
      <div className="bg-white ring-1 ring-black/5 rounded-2xl p-12 text-center">
        <h3 className="font-serif text-2xl mb-2">No venues yet</h3>
        <p className="text-sm text-lead/60 mb-6">Create your first listing.</p>
        <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Link to="/host/venues/new">List a venue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((v) => (
        <div key={v.id} className="bg-white ring-1 ring-black/5 rounded-2xl overflow-hidden">
          <div className="aspect-[4/3] bg-stone-100">
            {v.cover_image_url ? (
              <img src={v.cover_image_url} alt={v.name} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="p-5">
            <h3 className="font-medium text-lg">{v.name}</h3>
            <p className="text-sm text-lead/50 mb-2">{formatAddress(v.address_data)}</p>
            <p className="text-sm font-medium mb-4">
              {formatMoney(v.base_price_cents, v.currency)}{" "}
              <span className="text-lead/40 font-normal">/ hour</span>
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-full flex-1">
                <Link to="/host/venues/$venueId/edit" params={{ venueId: v.id }}>
                  Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  if (confirm(`Delete "${v.name}"?`)) del.mutate(v.id);
                }}
              >
                Delete
              </Button>
            </div>
            <span
              className={`mt-3 inline-block text-[10px] uppercase tracking-widest font-bold rounded px-2 py-0.5 ${v.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}
            >
              {v.is_active ? "Active" : "Hidden"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
