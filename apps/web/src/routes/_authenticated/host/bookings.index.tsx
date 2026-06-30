import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listHostBookings } from "@/server-adapters/bookings.functions";
import { formatMoney, formatDateRange } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/host/bookings/")({
  component: HostBookingsPage,
});

function sourceBadge(source: string) {
  switch (source) {
    case "online":
      return { label: "Online", cls: "bg-blue-100 text-blue-700" };
    case "offline":
      return { label: "Offline", cls: "bg-purple-100 text-purple-700" };
    case "block_off":
      return { label: "Blocked", cls: "bg-stone-200 text-stone-600" };
    default:
      return { label: source, cls: "bg-stone-100 text-stone-500" };
  }
}

function HostBookingsPage() {
  const fn = useServerFn(listHostBookings);
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["host-bookings"],
    queryFn: () => fn({}),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
        <Link
          to="/host/bookings/block-off"
          className="ring-1 ring-black/10 rounded-full px-4 py-2 text-sm font-medium hover:bg-stone-50"
        >
          Block off time
        </Link>
        <Link
          to="/host/bookings/new"
          className="bg-brand text-brand-foreground rounded-full px-4 py-2 text-sm font-medium hover:bg-brand/90"
        >
          + New offline booking
        </Link>
      </div>

      {isLoading ? (
        <p className="text-lead/50 text-center py-12">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-lead/50 text-center py-12 bg-white rounded-2xl ring-1 ring-black/5">
          No bookings yet.
        </p>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold">
              <tr>
                <th className="px-6 py-3">When</th>
                <th className="px-6 py-3">Venue</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-950/5 text-sm">
              {bookings.map((b) => {
                const v = b.venues as { name?: string } | null;
                const badge = sourceBadge(b.source ?? "online");
                const customerLabel =
                  b.source === "block_off"
                    ? "—"
                    : (b.guest_name ?? (b.customer_id ? "Online customer" : "—"));
                return (
                  <tr key={b.id}>
                    <td className="px-6 py-4">{formatDateRange(b.start_time, b.end_time)}</td>
                    <td className="px-6 py-4 font-medium">{v?.name ?? "—"}</td>
                    <td className="px-6 py-4">{customerLabel}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {b.source === "block_off" ? "—" : formatMoney(b.total_cents, b.currency)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : b.status === "cancelled"
                                ? "bg-stone-100 text-stone-500"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
