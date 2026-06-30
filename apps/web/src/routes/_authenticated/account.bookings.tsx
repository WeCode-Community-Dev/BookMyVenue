import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyBookings, cancelBooking } from "@/server-adapters/bookings.functions";
import { getInvoiceDownloadUrl } from "@/server-adapters/invoices.functions";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { formatDateRange, formatMoney, formatAddress } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/account/bookings")({
  head: () => ({ meta: [{ title: "My bookings — Book My Venue" }] }),
  validateSearch: (s) => z.object({ highlight: z.string().uuid().optional() }).parse(s),
  component: MyBookingsPage,
});

function MyBookingsPage() {
  const { highlight } = Route.useSearch();
  const queryClient = useQueryClient();
  const listFn = useServerFn(listMyBookings);
  const cancelFn = useServerFn(cancelBooking);
  const invoiceFn = useServerFn(getInvoiceDownloadUrl);

  async function handleDownloadInvoice(id: string) {
    try {
      const { url } = await invoiceFn({ data: { booking_id: id } });
      window.open(url, "_blank", "noopener");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invoice not available yet");
    }
  }

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => listFn({}),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelFn({ data: { booking_id: id } }),
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-2">My bookings</h1>
        <p className="text-sm text-lead/60 mb-10">Your upcoming and past venue reservations.</p>

        {isLoading ? (
          <div className="text-center text-lead/50 py-24">Loading…</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white ring-1 ring-black/5 rounded-2xl p-12 text-center">
            <h3 className="font-serif text-2xl mb-2">No bookings yet</h3>
            <p className="text-sm text-lead/60 mb-6">Find your perfect space and reserve it.</p>
            <Button
              asChild
              className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Link to="/venues">Browse venues</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const venue = b.venues as {
                name?: string;
                address_data?: unknown;
                cover_image_url?: string | null;
              } | null;
              const isHighlighted = highlight === b.id;
              return (
                <div
                  key={b.id}
                  className={`bg-white rounded-2xl ring-1 p-5 flex flex-col md:flex-row gap-5 items-start md:items-center ${isHighlighted ? "ring-brand" : "ring-black/5"}`}
                >
                  <div className="w-full md:w-32 aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 ring-1 ring-black/5 shrink-0">
                    {venue?.cover_image_url ? (
                      <img
                        src={venue.cover_image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{venue?.name ?? "Venue"}</h3>
                    <p className="text-sm text-lead/60">{formatAddress(venue?.address_data)}</p>
                    <p className="text-sm text-lead/60 mt-1">
                      {formatDateRange(b.start_time, b.end_time)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={b.status} />
                      <span className="text-sm font-medium">
                        {formatMoney(b.total_cents, b.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {b.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(b.id)}
                        className="rounded-full"
                      >
                        Download invoice
                      </Button>
                    )}
                    {(b.status === "pending" || b.status === "confirmed") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelMutation.mutate(b.id)}
                        disabled={cancelMutation.isPending}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "confirmed"
      ? "bg-green-100 text-green-700"
      : status === "pending"
        ? "bg-amber-100 text-amber-700"
        : status === "cancelled"
          ? "bg-stone-100 text-stone-500"
          : "bg-red-100 text-red-700";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${color}`}
    >
      {status}
    </span>
  );
}
