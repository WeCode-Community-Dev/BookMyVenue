import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAllCoupons, setCouponActive } from "@/server-adapters/admin.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  component: AdminCoupons,
});

function AdminCoupons() {
  const fn = useServerFn(listAllCoupons);
  const upd = useServerFn(setCouponActive);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-coupons"], queryFn: () => fn() });

  async function toggle(id: string, active: boolean) {
    await upd({ data: { id, active: !active } });
    qc.invalidateQueries({ queryKey: ["admin-coupons"] });
  }

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold text-left">
          <tr>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Venue</th>
            <th className="px-4 py-3">Discount</th>
            <th className="px-4 py-3">Used</th>
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
          {data.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium">{c.code}</td>
              <td className="px-4 py-3 text-xs">{c.venues?.name ?? "Any"}</td>
              <td className="px-4 py-3 text-xs">
                {c.discount_type === "percentage"
                  ? `${c.discount_value}%`
                  : `${c.discount_value} off`}
              </td>
              <td className="px-4 py-3 text-xs">
                {c.times_used}
                {c.usage_limit ? ` / ${c.usage_limit}` : ""}
              </td>
              <td className="px-4 py-3 text-xs">
                {c.is_active ? (
                  <span className="text-emerald-700">Active</span>
                ) : (
                  <span className="text-lead/50">Inactive</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant={c.is_active ? "destructive" : "default"}
                  onClick={() => toggle(c.id, c.is_active)}
                >
                  {c.is_active ? "Deactivate" : "Activate"}
                </Button>
              </td>
            </tr>
          ))}
          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-lead/50">
                No coupons.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
