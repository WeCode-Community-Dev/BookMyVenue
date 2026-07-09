import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listHostCoupons, createCoupon, deleteCoupon } from "@/server-adapters/coupons.functions";
import { listHostVenues } from "@/server-adapters/venues.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/host/coupons")({
  component: HostCouponsPage,
});

function HostCouponsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listHostCoupons);
  const venuesFn = useServerFn(listHostVenues);
  const createFn = useServerFn(createCoupon);
  const delFn = useServerFn(deleteCoupon);

  const { data: coupons = [] } = useQuery({
    queryKey: ["host-coupons"],
    queryFn: () => listFn({}),
  });
  const { data: venues = [] } = useQuery({
    queryKey: ["host-venues"],
    queryFn: () => venuesFn({}),
  });

  const [form, setForm] = useState({
    code: "",
    venue_id: "",
    discount_type: "percentage" as "percentage" | "fixed_amount",
    discount_value: 10,
    usage_limit: "",
  });

  const create = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          code: form.code,
          venue_id: form.venue_id || null,
          discount_type: form.discount_type,
          discount_value: Number(form.discount_value),
          usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
          is_active: true,
        },
      }),
    onSuccess: () => {
      toast.success("Coupon created");
      qc.invalidateQueries({ queryKey: ["host-coupons"] });
      setForm({
        code: "",
        venue_id: "",
        discount_type: "percentage",
        discount_value: 10,
        usage_limit: "",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["host-coupons"] }),
  });

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="bg-white ring-1 ring-black/5 rounded-2xl p-6 space-y-4"
        >
          <h3 className="font-serif text-xl">New coupon</h3>
          <div>
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="ATELIER10"
              required
            />
          </div>
          <div>
            <Label>Venue</Label>
            <Select
              value={form.venue_id || "all"}
              onValueChange={(v) => setForm({ ...form, venue_id: v === "all" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All my venues</SelectItem>
                {venues.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select
                value={form.discount_type}
                onValueChange={(v) =>
                  setForm({ ...form, discount_type: v as "percentage" | "fixed_amount" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed_amount">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">{form.discount_type === "percentage" ? "%" : "Amount"}</Label>
              <Input
                id="value"
                type="number"
                min={1}
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="limit">Usage limit (optional)</Label>
            <Input
              id="limit"
              type="number"
              min={1}
              value={form.usage_limit}
              onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            disabled={create.isPending}
            className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {create.isPending ? "Creating…" : "Create coupon"}
          </Button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white ring-1 ring-black/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h3 className="font-medium">Your coupons</h3>
          </div>
          {coupons.length === 0 ? (
            <p className="text-lead/50 text-sm text-center py-10">No coupons yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-stone-50 text-[11px] uppercase tracking-widest text-lead/40 font-bold">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Venue</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Used</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-950/5 text-sm">
                {coupons.map((c) => {
                  const v = c.venues as { name?: string } | null;
                  return (
                    <tr key={c.id}>
                      <td className="px-6 py-3 font-mono font-medium">{c.code}</td>
                      <td className="px-6 py-3">{v?.name ?? "All venues"}</td>
                      <td className="px-6 py-3">
                        {c.discount_type === "percentage"
                          ? `${c.discount_value}%`
                          : `$${c.discount_value}`}
                      </td>
                      <td className="px-6 py-3">
                        {c.times_used}
                        {c.usage_limit ? ` / ${c.usage_limit}` : ""}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => del.mutate(c.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
