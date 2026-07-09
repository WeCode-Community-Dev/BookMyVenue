import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  listAllBookings,
  updateBookingStatus,
  expireStuckBookings,
} from "@/server-adapters/admin.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

type Discrepancy = "" | "stuck_pending" | "confirmed_unpaid";
type Status = "" | "pending" | "confirmed" | "cancelled" | "expired";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  validateSearch: (s: Record<string, unknown>) => ({
    discrepancy: (s.discrepancy as Discrepancy) || ("" as Discrepancy),
  }),
  component: AdminBookings,
});

function AdminBookings() {
  const search0 = Route.useSearch();
  const fn = useServerFn(listAllBookings);
  const upd = useServerFn(updateBookingStatus);
  const exp = useServerFn(expireStuckBookings);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("");
  const [discrepancy, setDiscrepancy] = useState<Discrepancy>(search0.discrepancy ?? "");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-bookings", search, status, discrepancy],
    queryFn: () =>
      fn({
        data: {
          search: search || undefined,
          status: status || undefined,
          discrepancy: discrepancy || undefined,
        },
      }),
  });

  async function setStatusFor(id: string, s: "pending" | "confirmed" | "cancelled" | "expired") {
    await upd({ data: { id, status: s } });
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  async function bulkExpire() {
    const res = await exp();
    alert(`Expired ${res.count} stuck booking${res.count === 1 ? "" : "s"}.`);
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          placeholder="Search guest/venue…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="border rounded-md px-3 text-sm bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
        <select
          className="border rounded-md px-3 text-sm bg-white"
          value={discrepancy}
          onChange={(e) => setDiscrepancy(e.target.value as Discrepancy)}
        >
          <option value="">No discrepancy filter</option>
          <option value="stuck_pending">Stuck pending (past expiry)</option>
          <option value="confirmed_unpaid">Confirmed but unpaid</option>
        </select>
        {discrepancy === "stuck_pending" && (
          <Button size="sm" variant="destructive" onClick={bulkExpire}>
            Expire all stuck
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold text-left">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-950/5">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-lead/50">
                  Loading…
                </td>
              </tr>
            )}
            {data.map((b) => {
              const paid = (b.payments ?? []).some(
                (p: { status: string }) => p.status === "succeeded",
              );
              return (
                <tr key={b.id}>
                  <td className="px-4 py-3 text-xs">{new Date(b.start_time).toLocaleString()}</td>
                  <td className="px-4 py-3">{b.venues?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{b.customer?.email ?? b.guest_email ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {formatMoney(b.total_cents, b.currency)}{" "}
                    {paid ? <span className="text-emerald-700">· paid</span> : null}
                  </td>
                  <td className="px-4 py-3 text-xs capitalize">{b.status}</td>
                  <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                    {b.status !== "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatusFor(b.id, "confirmed")}
                      >
                        Confirm
                      </Button>
                    )}
                    {b.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatusFor(b.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    )}
                    {b.status !== "expired" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatusFor(b.id, "expired")}
                      >
                        Expire
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-lead/50">
                  No bookings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
