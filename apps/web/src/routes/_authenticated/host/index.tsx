import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listHostVenues } from "@/server-adapters/venues.functions";
import { listHostBookings } from "@/server-adapters/bookings.functions";
import { formatMoney } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/host/")({
  component: HostOverview,
});

function HostOverview() {
  const venuesFn = useServerFn(listHostVenues);
  const bookingsFn = useServerFn(listHostBookings);

  const { data: venues = [] } = useQuery({
    queryKey: ["host-venues"],
    queryFn: () => venuesFn({}),
  });
  const { data: bookings = [] } = useQuery({
    queryKey: ["host-bookings"],
    queryFn: () => bookingsFn({}),
  });

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const pending = bookings.filter((b) => b.status === "pending");
  const revenue = confirmed.reduce((acc, b) => acc + b.total_cents, 0);
  const currency = bookings[0]?.currency ?? "USD";

  const stats = [
    { label: "Total revenue", value: formatMoney(revenue, currency) },
    { label: "Active bookings", value: confirmed.length.toString() },
    { label: "Pending inquiries", value: pending.length.toString() },
    { label: "Venues listed", value: venues.length.toString() },
  ];

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl ring-1 ring-black/5">
            <span className="block text-xs uppercase tracking-widest text-lead/40 font-semibold mb-2">
              {s.label}
            </span>
            <span className="text-2xl font-serif">{s.value}</span>
          </div>
        ))}
      </div>

      {venues.length === 0 ? (
        <div className="bg-white ring-1 ring-black/5 rounded-2xl p-12 text-center">
          <h3 className="font-serif text-2xl mb-2">No venues yet</h3>
          <p className="text-sm text-lead/60 mb-6">
            List your first space to start receiving bookings.
          </p>
          <Link
            to="/host/venues/new"
            className="inline-flex rounded-full bg-brand text-brand-foreground px-6 py-2 text-sm font-medium"
          >
            List a venue
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
            <h2 className="font-medium">Recent bookings</h2>
            <Link to="/host/bookings" className="text-xs text-brand font-medium">
              View all →
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="px-6 py-10 text-sm text-lead/50 text-center">No bookings yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Venue</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-950/5 text-sm">
                {bookings.slice(0, 6).map((b) => {
                  const v = b.venues as { name?: string } | null;
                  return (
                    <tr key={b.id}>
                      <td className="px-6 py-4">{new Date(b.start_time).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium">{v?.name ?? "—"}</td>
                      <td className="px-6 py-4">{formatMoney(b.total_cents, b.currency)}</td>
                      <td className="px-6 py-4 text-right capitalize text-xs">{b.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
