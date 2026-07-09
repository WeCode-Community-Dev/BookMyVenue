import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { createVenue } from "@/server-adapters/venues.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { storageProvider } from "@/infrastructure/providers";
import { authProvider } from "@/infrastructure/providers";
import { X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/host/venues/new")({
  component: NewVenuePage,
});

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white ring-1 ring-black/5 rounded-2xl p-6">
    <div className="mb-5">
      <h3 className="font-serif text-xl">{title}</h3>
      {subtitle && <p className="text-sm text-lead/55 mt-1">{subtitle}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

function NewVenuePage() {
  const navigate = useNavigate();
  const createFn = useServerFn(createVenue);
  const [form, setForm] = useState({
    // Basics
    name: "",
    description: "",
    venue_type: "wedding" as VenueType,
    capacity: 100,
    min_booking_hours: 4,
    // Pricing
    price: 500,
    currency: "INR",
    pricing_mode: "per_hour" as PricingMode,
    // Address
    address_line1: "",
    address_line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    // Business
    gstin: "",
    contact_phone: "",
    contact_email: "",
    // Details
    amenities: "",
    rules: "",
    cancellation_policy: "",
    // Media
    cover_image_url: "",
    gallery_urls: [] as string[],
  });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  async function uploadFile(file: File): Promise<string | null> {
    const session = await authProvider.getSession();
    const userId = session?.user.id;
    if (!userId) {
      toast.error("Sign in required");
      return null;
    }
    const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
    try {
      await storageProvider.upload("venue-images", path, file, { contentType: file.type });
      return storageProvider.getPublicUrl("venue-images", path);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      return null;
    }
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadFile(file);
    if (url) setForm((f) => ({ ...f, cover_image_url: url }));
    setUploadingCover(false);
  }

  async function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    setForm((f) => ({ ...f, gallery_urls: [...f.gallery_urls, ...urls].slice(0, 20) }));
    setUploadingGallery(false);
    e.target.value = "";
    if (urls.length) toast.success(`${urls.length} photo(s) added`);
  }

  const create = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          name: form.name,
          description: form.description,
          venue_type: form.venue_type,
          capacity: Number(form.capacity),
          base_price_cents: Math.round(Number(form.price) * 100),
          currency: form.currency,
          pricing_mode: form.pricing_mode,
          address_data: {
            address_line1: form.address_line1,
            address_line2: form.address_line2,
            landmark: form.landmark,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: form.country,
            gstin: form.gstin,
            contact_phone: form.contact_phone,
            contact_email: form.contact_email,
            rules: form.rules,
            cancellation_policy: form.cancellation_policy,
            min_booking_hours: Number(form.min_booking_hours) || 1,
          },
          amenities: form.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          cover_image_url: form.cover_image_url || null,
          gallery_urls: form.gallery_urls,
          is_active: true,
        },
      }),
    onSuccess: () => {
      toast.success("Venue listed");
      navigate({ to: "/host/venues" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [mode, setMode] = useState<"edit" | "preview">("edit");

  function handleReview() {
    if (!form.name.trim()) return toast.error("Venue name is required");
    if (!form.city.trim() || !form.country.trim())
      return toast.error("City and country are required");
    if (!form.cover_image_url) return toast.error("Please add a cover photo");
    setMode("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (mode === "preview") {
    const priceCents = Math.round(Number(form.price) * 100);
    const addressLine = [
      form.address_line1,
      form.address_line2,
      form.landmark,
      form.city,
      form.state,
      form.pincode,
      form.country,
    ]
      .filter(Boolean)
      .join(", ");
    const amenities = form.amenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      <div className="max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-3 bg-amber-50 ring-1 ring-amber-200 text-amber-900 rounded-xl px-4 py-3">
          <p className="text-sm font-medium">
            Preview — this is how your listing will appear to guests. Nothing has been published
            yet.
          </p>
        </div>

        <article className="bg-white ring-1 ring-black/5 rounded-2xl overflow-hidden">
          <div className="aspect-[16/9] bg-stone-100">
            {form.cover_image_url && (
              <img
                src={form.cover_image_url}
                alt={form.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-8 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <header>
                <span className="text-[10px] uppercase tracking-widest font-bold text-lead/50">
                  {form.venue_type}
                </span>
                <h1 className="font-serif text-4xl mt-1">{form.name}</h1>
                <p className="text-sm text-lead/60 mt-2">{addressLine}</p>
                <p className="text-sm text-lead/60 mt-1">
                  Up to {form.capacity} guests · Min {form.min_booking_hours} hr booking
                </p>
              </header>

              {form.gallery_urls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {form.gallery_urls.map((url) => (
                    <div
                      key={url}
                      className="aspect-square rounded-lg overflow-hidden ring-1 ring-black/5"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {form.description && (
                <section>
                  <h2 className="text-lg font-medium mb-3">About this space</h2>
                  <p className="text-lead/70 whitespace-pre-line text-pretty">{form.description}</p>
                </section>
              )}

              {amenities.length > 0 && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-lead/50 mb-3">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <span
                        key={a}
                        className="px-3 py-1 bg-stone-100 text-[12px] font-medium rounded-full ring-1 ring-black/5"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {form.rules && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-lead/50 mb-2">
                    House rules
                  </h3>
                  <p className="text-sm text-lead/70 whitespace-pre-line">{form.rules}</p>
                </section>
              )}

              {form.cancellation_policy && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-lead/50 mb-2">
                    Cancellation policy
                  </h3>
                  <p className="text-sm text-lead/70 whitespace-pre-line">
                    {form.cancellation_policy}
                  </p>
                </section>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-stone-50 rounded-2xl p-6 ring-1 ring-black/5 space-y-4 sticky top-24">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl text-brand">
                    {form.currency} {(priceCents / 100).toLocaleString()}
                  </span>
                  <span className="text-sm text-lead/50">
                    {pricingUnitLabel(form.pricing_mode)}
                  </span>
                </div>
                <div className="border-t border-black/5 pt-4 space-y-2 text-sm">
                  {form.contact_phone && (
                    <p>
                      <span className="text-lead/50">Phone:</span> {form.contact_phone}
                    </p>
                  )}
                  {form.contact_email && (
                    <p>
                      <span className="text-lead/50">Email:</span> {form.contact_email}
                    </p>
                  )}
                  {form.gstin && (
                    <p>
                      <span className="text-lead/50">GSTIN:</span> {form.gstin}
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </article>

        <div className="flex gap-3 mt-6 sticky bottom-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => setMode("edit")}
          >
            ← Back to edit
          </Button>
          <Button
            type="button"
            disabled={create.isPending}
            onClick={() => create.mutate()}
            className="flex-1 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {create.isPending ? "Publishing…" : "Publish venue"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h2 className="font-serif text-3xl">List a new venue</h2>
        <p className="text-sm text-lead/60 mt-1">
          Tell guests everything they need to know to book with confidence.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleReview();
        }}
        className="space-y-6"
      >
        <Section title="Basics" subtitle="Name, type, and capacity.">
          <div>
            <Label htmlFor="name">Venue name</Label>
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
              placeholder="Tell guests about your space, ambience, and what makes it unique."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="capacity">Max capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="minhrs">Minimum booking (hrs)</Label>
              <Input
                id="minhrs"
                type="number"
                min={1}
                max={72}
                value={form.min_booking_hours}
                onChange={(e) => setForm({ ...form, min_booking_hours: Number(e.target.value) })}
              />
            </div>
          </div>
        </Section>

        <Section
          title="Pricing"
          subtitle="Choose how you charge: by the hour, by the day, a flat event price, or per person."
        >
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ({pricingUnitLabel(form.pricing_mode)})</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
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
        </Section>

        <Section title="Address" subtitle="Where is the venue located?">
          <div>
            <Label htmlFor="addr1">Address line 1</Label>
            <Input
              id="addr1"
              value={form.address_line1}
              onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
              placeholder="Building / street"
              required
            />
          </div>
          <div>
            <Label htmlFor="addr2">Address line 2</Label>
            <Input
              id="addr2"
              value={form.address_line2}
              onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
              placeholder="Area / locality"
            />
          </div>
          <div>
            <Label htmlFor="landmark">Landmark</Label>
            <Input
              id="landmark"
              value={form.landmark}
              onChange={(e) => setForm({ ...form, landmark: e.target.value })}
              placeholder="Nearby landmark to help guests find you"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
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
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                placeholder="560001"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                required
              />
            </div>
          </div>
        </Section>

        <Section title="Business details" subtitle="Used for invoicing and guest communication.">
          <div>
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              value={form.gstin}
              onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Contact phone</Label>
              <Input
                id="phone"
                type="tel"
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="email">Contact email</Label>
              <Input
                id="email"
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                placeholder="bookings@example.com"
              />
            </div>
          </div>
        </Section>

        <Section title="Amenities & policies">
          <div>
            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
            <Input
              id="amenities"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              placeholder="Full Kitchen, AV Equipment, Parking, Wi-Fi"
            />
          </div>
          <div>
            <Label htmlFor="rules">House rules</Label>
            <Textarea
              id="rules"
              rows={3}
              value={form.rules}
              onChange={(e) => setForm({ ...form, rules: e.target.value })}
              placeholder="e.g. No outside catering. Music allowed till 10pm."
            />
          </div>
          <div>
            <Label htmlFor="cancel">Cancellation policy</Label>
            <Textarea
              id="cancel"
              rows={3}
              value={form.cancellation_policy}
              onChange={(e) => setForm({ ...form, cancellation_policy: e.target.value })}
              placeholder="e.g. Full refund up to 7 days before the event."
            />
          </div>
        </Section>

        <Section title="Photos" subtitle="Add a cover photo and up to 20 gallery photos.">
          <div>
            <Label htmlFor="cover">Cover photo</Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleCover}
              disabled={uploadingCover}
            />
            {form.cover_image_url && (
              <img
                src={form.cover_image_url}
                alt=""
                className="mt-3 w-full max-w-xs rounded-lg ring-1 ring-black/5"
              />
            )}
          </div>
          <div>
            <Label htmlFor="gallery">Gallery photos ({form.gallery_urls.length}/20)</Label>
            <Input
              id="gallery"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGallery}
              disabled={uploadingGallery || form.gallery_urls.length >= 20}
            />
            {uploadingGallery && <p className="text-xs text-lead/50 mt-2">Uploading…</p>}
            {form.gallery_urls.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.gallery_urls.map((url, i) => (
                  <div
                    key={url}
                    className="relative group aspect-square rounded-lg overflow-hidden ring-1 ring-black/5"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          gallery_urls: f.gallery_urls.filter((_, idx) => idx !== i),
                        }))
                      }
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => navigate({ to: "/host/venues" })}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={uploadingCover || uploadingGallery}
            className="flex-1 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            Review listing →
          </Button>
        </div>
      </form>
    </div>
  );
}
