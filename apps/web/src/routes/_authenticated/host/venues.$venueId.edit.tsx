import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getVenue, updateVenue } from "@/server-adapters/venues.functions";
import { listVenueReviews } from "@/server-adapters/reviews.functions";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VENUE_TYPES, type VenueType } from "@/lib/format";
import { PRICING_MODES, pricingUnitLabel, type PricingMode } from "@repo/domain/venues";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/host/venues/$venueId/edit")({
  component: EditVenuePage,
});

function EditVenuePage() {
  const { venueId } = Route.useParams();
  const navigate = useNavigate();
  const updateFn = useServerFn(updateVenue);
  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue", venueId],
    queryFn: () => getVenue({ data: { id: venueId } }),
  });

  const [form, setForm] = useState<{
    name: string;
    description: string;
    venue_type: VenueType;
    capacity: number;
    price: number;
    currency: string;
    pricing_mode: PricingMode;
    city: string;
    state: string;
    country: string;
    amenities: string;
    is_active: boolean;
  } | null>(null);

  useEffect(() => {
    if (!venue) return;
    const a = (venue.address_data ?? {}) as { city?: string; state?: string; country?: string };
    const amens = Array.isArray(venue.amenities)
      ? (venue.amenities as unknown[]).filter((x): x is string => typeof x === "string")
      : [];
    setForm({
      name: venue.name,
      description: venue.description ?? "",
      venue_type: venue.venue_type as VenueType,
      capacity: venue.capacity,
      price: venue.base_price_cents / 100,
      currency: venue.currency,
      pricing_mode: (venue.pricing_mode ?? "per_hour") as PricingMode,
      city: a.city ?? "",
      state: a.state ?? "",
      country: a.country ?? "",
      amenities: amens.join(", "),
      is_active: venue.is_active,
    });
  }, [venue]);

  const update = useMutation({
    mutationFn: () => {
      if (!form) throw new Error("not ready");
      return updateFn({
        data: {
          id: venueId,
          name: form.name,
          description: form.description,
          venue_type: form.venue_type,
          capacity: Number(form.capacity),
          base_price_cents: Math.round(Number(form.price) * 100),
          currency: form.currency,
          pricing_mode: form.pricing_mode,
          address_data: { city: form.city, state: form.state, country: form.country },
          amenities: form.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          is_active: form.is_active,
        },
      });
    },
    onSuccess: () => {
      toast.success("Venue updated");
      navigate({ to: "/host/venues" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !form) return <p className="text-lead/50 text-center py-12">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-2xl mb-6">Edit venue</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update.mutate();
        }}
        className="space-y-5 bg-white ring-1 ring-black/5 rounded-2xl p-6"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Venue type</Label>
            <Select
              value={form.venue_type}
              onValueChange={(v) => setForm({ ...form, venue_type: v as VenueType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENUE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Pricing mode</Label>
            <Select
              value={form.pricing_mode}
              onValueChange={(v) => setForm({ ...form, pricing_mode: v as PricingMode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICING_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price ({pricingUnitLabel(form.pricing_mode)})</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              maxLength={3}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="amen">Amenities (comma-separated)</Label>
          <Input
            id="amen"
            value={form.amenities}
            onChange={(e) => setForm({ ...form, amenities: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-stone-50 p-4">
          <div>
            <p className="font-medium text-sm">Active listing</p>
            <p className="text-xs text-lead/50">Toggle off to hide from public search.</p>
          </div>
          <Switch
            checked={form.is_active}
            onCheckedChange={(v) => setForm({ ...form, is_active: v })}
          />
        </div>
        <Button
          type="submit"
          disabled={update.isPending}
          className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {update.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <ReviewsPanel venueId={venueId} />
    </div>
  );
}

function ReviewsPanel({ venueId }: { venueId: string }) {
  const { data } = useQuery({
    queryKey: ["venue-reviews", venueId],
    queryFn: () => listVenueReviews({ data: { venueId } }),
  });
  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/venues/${venueId}` : "";

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied");
  };

  return (
    <section className="mt-10 space-y-6">
      <div className="bg-white ring-1 ring-black/5 rounded-2xl p-6">
        <h3 className="font-serif text-xl mb-2">Reviews link</h3>
        <p className="text-sm text-lead/60 mb-4">
          Share this link with guests so they can leave a review after their booking.
        </p>
        <div className="flex gap-2">
          <Input readOnly value={publicUrl} />
          <Button type="button" onClick={copy} variant="outline" className="rounded-full">
            Copy
          </Button>
        </div>
      </div>

      <div className="bg-white ring-1 ring-black/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl">Recent reviews</h3>
          {data && data.count > 0 && (
            <div className="flex items-center gap-2 text-sm text-lead/60">
              <StarRating value={data.average} readOnly size={14} />
              <span className="font-medium text-lead">{data.average.toFixed(1)}</span>
              <span>({data.count})</span>
            </div>
          )}
        </div>
        {data && data.count > 0 ? (
          <ul className="space-y-4">
            {data.reviews.slice(0, 10).map((r) => (
              <li key={r.id} className="border-b border-zinc-950/5 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{r.reviewer_name}</span>
                  <span className="text-xs text-lead/40">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <StarRating value={r.rating} readOnly size={12} />
                {r.feedback && (
                  <p className="text-sm text-lead/70 mt-2 whitespace-pre-line">{r.feedback}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-lead/50">No reviews yet.</p>
        )}
      </div>
    </section>
  );
}
