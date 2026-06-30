import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { listVenues } from "@/server-adapters/venues.functions";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { formatAddress, formatMoney, VENUE_TYPES, type VenueType } from "@/lib/format";
import { pricingUnitLabel, type PricingMode } from "@repo/domain/venues";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import conservatory from "@/assets/venue-conservatory.jpg";
import manor from "@/assets/venue-manor.jpg";
import loft from "@/assets/venue-loft.jpg";

const fallbacks = [conservatory, manor, loft];

const PRICING_MODES: { value: PricingMode; label: string }[] = [
  { value: "per_hour", label: "Per hour" },
  { value: "per_day", label: "Per day" },
  { value: "flat", label: "Flat rate" },
  { value: "per_person", label: "Per person" },
];

// Price slider works in major units (e.g. dollars / rupees). Converted to cents for the API.
const PRICE_MIN = 0;
const PRICE_MAX = 5000;
const PRICE_STEP = 50;

const SearchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(["wedding", "conference", "party", "celebration", "other"]).optional(),
  min: z.coerce.number().int().min(1).optional(),
  max: z.coerce.number().int().min(1).optional(),
  city: z.string().optional(),
  pmin: z.coerce.number().int().min(0).optional(),
  pmax: z.coerce.number().int().min(0).optional(),
  mode: z.enum(["per_hour", "per_day", "flat", "per_person"]).optional(),
});

type SearchState = z.infer<typeof SearchSchema>;

export const Route = createFileRoute("/venues/")({
  head: () => ({
    meta: [
      { title: "Browse venues — Book My Venue" },
      { name: "description", content: "Browse extraordinary spaces for your next event." },
      { property: "og:title", content: "Browse venues — Book My Venue" },
      { property: "og:description", content: "Browse extraordinary spaces for your next event." },
    ],
  }),
  validateSearch: (s) => SearchSchema.parse(s),
  component: VenuesPage,
});

function VenuesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  // Local input state for debounced filters
  const [qInput, setQInput] = useState(search.q ?? "");
  const [cityInput, setCityInput] = useState(search.city ?? "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    search.pmin ?? PRICE_MIN,
    search.pmax ?? PRICE_MAX,
  ]);

  // Sync local state when URL changes externally
  useEffect(() => {
    setQInput(search.q ?? "");
  }, [search.q]);
  useEffect(() => {
    setCityInput(search.city ?? "");
  }, [search.city]);
  useEffect(() => {
    setPriceRange([search.pmin ?? PRICE_MIN, search.pmax ?? PRICE_MAX]);
  }, [search.pmin, search.pmax]);

  // Debounce text + price commits to URL
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({
        search: (prev: SearchState) => ({
          ...prev,
          q: qInput || undefined,
          city: cityInput || undefined,
        }),
      });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput, cityInput]);

  const commitPrice = (vals: number[]) => {
    const [lo, hi] = vals as [number, number];
    navigate({
      search: (prev: SearchState) => ({
        ...prev,
        pmin: lo > PRICE_MIN ? lo : undefined,
        pmax: hi < PRICE_MAX ? hi : undefined,
      }),
    });
  };

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ["venues", search],
    queryFn: () =>
      listVenues({
        data: {
          search: search.q,
          venue_type: search.type as VenueType | undefined,
          min_capacity: search.min,
          max_capacity: search.max,
          min_price_cents: search.pmin !== undefined ? search.pmin * 100 : undefined,
          max_price_cents: search.pmax !== undefined ? search.pmax * 100 : undefined,
          city: search.city,
          pricing_mode: search.mode as PricingMode | undefined,
        },
      }),
  });

  const clearAll = () => {
    setQInput("");
    setCityInput("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    navigate({ search: {} });
  };

  const hasFilters =
    !!search.q ||
    !!search.type ||
    !!search.min ||
    !!search.max ||
    !!search.city ||
    search.pmin !== undefined ||
    search.pmax !== undefined ||
    !!search.mode;

  return (
    <div className="min-h-screen bg-surface text-lead">
      <SiteNav />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl mb-2">All venues</h1>
          <p className="text-sm text-lead/60">
            {venues.length} space{venues.length === 1 ? "" : "s"} available
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters sidebar */}
          <aside className="bg-white ring-1 ring-black/5 rounded-[20px] p-6 h-fit lg:sticky lg:top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-widest font-semibold text-lead/60">
                Filters
              </h2>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-brand hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="search"
                className="text-[10px] uppercase tracking-wider text-lead/50 font-bold"
              >
                Search
              </Label>
              <Input
                id="search"
                placeholder="Venue name…"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-[10px] uppercase tracking-wider text-lead/50 font-bold"
              >
                City
              </Label>
              <Input
                id="city"
                placeholder="e.g. Kochi"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-lead/50 font-bold">
                Venue type
              </Label>
              <Select
                value={search.type ?? "all"}
                onValueChange={(v) =>
                  navigate({
                    search: (prev: SearchState) => ({
                      ...prev,
                      type: v === "all" ? undefined : (v as SearchState["type"]),
                    }),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {VENUE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-lead/50 font-bold">
                Pricing mode
              </Label>
              <Select
                value={search.mode ?? "any"}
                onValueChange={(v) =>
                  navigate({
                    search: (prev: SearchState) => ({
                      ...prev,
                      mode: v === "any" ? undefined : (v as SearchState["mode"]),
                    }),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {PRICING_MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <Label className="text-[10px] uppercase tracking-wider text-lead/50 font-bold">
                  Price range
                </Label>
                <span className="text-xs text-lead/60">
                  ${priceRange[0]} – ${priceRange[1]}
                  {priceRange[1] === PRICE_MAX ? "+" : ""}
                </span>
              </div>
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={priceRange}
                onValueChange={(v) => setPriceRange(v as [number, number])}
                onValueCommit={commitPrice}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-lead/50 font-bold">
                Capacity (guests)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Min"
                  value={search.min ?? ""}
                  onChange={(e) => {
                    const n = e.target.value ? Number(e.target.value) : undefined;
                    navigate({ search: (prev: SearchState) => ({ ...prev, min: n }) });
                  }}
                />
                <Input
                  type="number"
                  min={1}
                  placeholder="Max"
                  value={search.max ?? ""}
                  onChange={(e) => {
                    const n = e.target.value ? Number(e.target.value) : undefined;
                    navigate({ search: (prev: SearchState) => ({ ...prev, max: n }) });
                  }}
                />
              </div>
            </div>

            {hasFilters && (
              <Button variant="outline" className="w-full" onClick={clearAll}>
                Reset filters
              </Button>
            )}
          </aside>

          {/* Results */}
          <div>
            {isLoading ? (
              <div className="text-center text-lead/50 py-24">Loading venues…</div>
            ) : venues.length === 0 ? (
              <div className="bg-white ring-1 ring-black/5 rounded-[20px] p-12 text-center">
                <h3 className="font-serif text-2xl mb-2">No matches</h3>
                <p className="text-sm text-lead/60">
                  Try adjusting your filters or list the first venue yourself.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {venues.map((v, i) => (
                  <Link
                    key={v.id}
                    to="/venues/$venueId"
                    params={{ venueId: v.id }}
                    className="group"
                  >
                    <div className="w-full aspect-[4/5] bg-stone-100 rounded-[12px] overflow-hidden mb-4 ring-1 ring-black/5">
                      <img
                        src={v.cover_image_url || fallbacks[i % fallbacks.length]}
                        alt={v.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading={i < 3 ? "eager" : "lazy"}
                      />
                    </div>
                    <h3 className="font-medium text-lg">{v.name}</h3>
                    <p className="text-sm text-lead/50 mb-2">
                      Up to {v.capacity} guests · {formatAddress(v.address_data)}
                    </p>
                    <p className="text-sm font-medium">
                      From {formatMoney(v.base_price_cents, v.currency)}
                      <span className="text-lead/40 font-normal">
                        {" "}
                        · {pricingUnitLabel((v.pricing_mode ?? "per_hour") as PricingMode)}
                      </span>
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
