import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAllVenues, setVenueSuspended } from "@/server-adapters/admin.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/venues")({
  component: AdminVenues,
});

function AdminVenues() {
  const fn = useServerFn(listAllVenues);
  const sFn = useServerFn(setVenueSuspended);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "active" | "inactive" | "suspended">("");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-venues", search, status],
    queryFn: () => fn({ data: { search: search || undefined, status: status || undefined } }),
  });

  async function toggle(id: string, suspended: boolean) {
    await sFn({ data: { venueId: id, suspended: !suspended } });
    qc.invalidateQueries({ queryKey: ["admin-venues"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search venue name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="border rounded-md px-3 text-sm bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as "" | "active" | "inactive" | "suspended")}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold text-left">
            <tr>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Host</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-950/5">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-lead/50">
                  Loading…
                </td>
              </tr>
            )}
            {data.map((v) => (
              <tr key={v.id} className={v.is_suspended ? "bg-amber-50/40" : ""}>
                <td className="px-4 py-3">
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-lead/50 capitalize">
                    {v.venue_type} · cap {v.capacity}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {v.host ? (
                    <>
                      <div>
                        {[v.host.first_name, v.host.last_name].filter(Boolean).join(" ") || "—"}
                      </div>
                      <div className="text-lead/50">{v.host.email}</div>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {formatMoney(v.base_price_cents, v.currency)}/
                  {v.pricing_mode === "per_hour" ? "hr" : "day"}
                </td>
                <td className="px-4 py-3 text-xs">
                  {v.is_suspended ? (
                    <span className="text-amber-700">Suspended</span>
                  ) : v.is_active ? (
                    <span className="text-emerald-700">Active</span>
                  ) : (
                    <span className="text-lead/50">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/host/venues/$venueId/edit" params={{ venueId: v.id }}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant={v.is_suspended ? "default" : "destructive"}
                    onClick={() => toggle(v.id, v.is_suspended)}
                  >
                    {v.is_suspended ? "Unsuspend" : "Suspend"}
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-lead/50">
                  No venues.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
