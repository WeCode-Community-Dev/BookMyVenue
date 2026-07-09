import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPlatformStats } from "@/server-adapters/admin.functions";
import { formatMoney } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

type Stats = {
  users_total: number;
  users_suspended: number;
  users_new_30d: number;
  hosts_total: number;
  admins_total: number;
  venues_total: number;
  venues_active: number;
  venues_suspended: number;
  bookings_total: number;
  bookings_by_status: Record<string, number> | null;
  bookings_30d: number;
  bookings_pending_expired: number;
  revenue_cents_total: number;
  revenue_cents_30d: number;
  confirmed_without_payment: number;
  bookings_trend_30d: { day: string; count: number }[];
};

function AdminOverview() {
  const fn = useServerFn(getPlatformStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });

  if (isLoading) return <p className="text-sm text-lead/50">Loading stats…</p>;
  const s = data as unknown as Stats | undefined;
  if (!s) return <p>No data.</p>;

  const kpis = [
    { label: "Users", value: s.users_total, sub: `${s.users_new_30d} new · 30d` },
    { label: "Hosts", value: s.hosts_total, sub: `${s.admins_total} admins` },
    { label: "Venues active", value: s.venues_active, sub: `${s.venues_suspended} suspended` },
    { label: "Bookings", value: s.bookings_total, sub: `${s.bookings_30d} · 30d` },
    {
      label: "Revenue total",
      value: formatMoney(s.revenue_cents_total, "USD"),
      sub: `${formatMoney(s.revenue_cents_30d, "USD")} · 30d`,
    },
  ];

  const discrepancies = [
    {
      label: "Stuck pending (past expiry)",
      value: s.bookings_pending_expired,
      fix: "/admin/bookings?discrepancy=stuck_pending",
    },
    {
      label: "Confirmed but unpaid",
      value: s.confirmed_without_payment,
      fix: "/admin/bookings?discrepancy=confirmed_unpaid",
    },
    { label: "Suspended users", value: s.users_suspended, fix: "/admin/users" },
  ];

  const maxTrend = Math.max(1, ...s.bookings_trend_30d.map((d) => d.count));

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white p-5 rounded-2xl ring-1 ring-black/5">
            <span className="block text-[11px] uppercase tracking-widest text-lead/40 font-semibold mb-1">
              {k.label}
            </span>
            <span className="block text-2xl font-serif">{k.value}</span>
            <span className="block text-xs text-lead/50 mt-1">{k.sub}</span>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl ring-1 ring-black/5 p-6">
        <h2 className="font-medium mb-4">Bookings — last 30 days</h2>
        <div className="flex items-end gap-1 h-32">
          {s.bookings_trend_30d.length === 0 ? (
            <p className="text-sm text-lead/50">No bookings yet.</p>
          ) : (
            s.bookings_trend_30d.map((d) => (
              <div
                key={d.day}
                className="flex-1 bg-brand/70 rounded-t"
                title={`${d.day}: ${d.count}`}
                style={{ height: `${(d.count / maxTrend) * 100}%` }}
              />
            ))
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {Object.entries(s.bookings_by_status ?? {}).map(([k, v]) => (
            <div key={k} className="bg-stone-50 rounded-lg px-3 py-2 flex justify-between">
              <span className="capitalize text-lead/60">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl ring-1 ring-black/5 p-6">
        <h2 className="font-medium mb-4">Discrepancies</h2>
        <div className="space-y-2">
          {discrepancies.map((d) => (
            <div
              key={d.label}
              className="flex items-center justify-between border-b last:border-0 border-black/5 py-2"
            >
              <span className="text-sm">{d.label}</span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${d.value > 0 ? "text-amber-700" : "text-lead/40"}`}
                >
                  {d.value}
                </span>
                {d.value > 0 && (
                  <a href={d.fix} className="text-xs text-brand font-medium">
                    Resolve →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
