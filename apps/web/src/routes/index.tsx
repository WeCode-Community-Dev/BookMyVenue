import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { listVenues } from "@/server-adapters/venues.functions";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { formatAddress, formatMoney, VENUE_TYPES } from "@/lib/format";
import conservatory from "@/assets/venue-conservatory.jpg";
import manor from "@/assets/venue-manor.jpg";
import loft from "@/assets/venue-loft.jpg";

const fallbackImages = [conservatory, manor, loft];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Book My Venue — Spaces for moments that matter" },
      {
        name: "description",
        content:
          "From intimate glass conservatories to storied stone manors, find the perfect setting for your next celebration, wedding, conference, or party.",
      },
      { property: "og:title", content: "Book My Venue — Spaces for moments that matter" },
      {
        property: "og:description",
        content: "Book extraordinary venues for weddings, conferences, parties, and celebrations.",
      },
      { property: "og:image", content: conservatory },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("");
  const [guests, setGuests] = useState("");

  const { data: venues } = useQuery({
    queryKey: ["venues", { featured: true }],
    queryFn: () => listVenues({ data: {} }),
  });

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (type) params.type = type;
    if (guests) params.min = guests;
    navigate({ to: "/venues", search: params });
  }

  return (
    <div className="min-h-screen bg-surface text-lead selection:bg-brand/10">
      <SiteNav />

      <section className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-[48ch] mb-12">
            <h1 className="font-serif text-5xl lg:text-7xl leading-none text-balance mb-6">
              Spaces for moments that matter.
            </h1>
            <p className="text-lg text-lead/60 text-pretty">
              From intimate glass conservatories to storied stone manors, find the perfect setting
              for your next assembly.
            </p>
          </div>

          <form
            onSubmit={onSearch}
            className="bg-white ring-1 ring-black/5 rounded-[24px] p-2 flex flex-col md:flex-row gap-2 shadow-sm"
          >
            <div className="flex-1 px-4 py-3">
              <label className="block text-[10px] uppercase tracking-wider text-lead/40 font-semibold mb-1">
                Location or name
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Where are you hosting?"
                className="w-full bg-transparent outline-none text-sm placeholder:text-lead/30"
              />
            </div>
            <div className="w-px bg-zinc-950/5 hidden md:block" />
            <div className="flex-1 px-4 py-3">
              <label className="block text-[10px] uppercase tracking-wider text-lead/40 font-semibold mb-1">
                Event Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent outline-none text-sm appearance-none"
              >
                <option value="">Any</option>
                {VENUE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-px bg-zinc-950/5 hidden md:block" />
            <div className="flex-1 px-4 py-3">
              <label className="block text-[10px] uppercase tracking-wider text-lead/40 font-semibold mb-1">
                Guests
              </label>
              <input
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                type="number"
                min="1"
                placeholder="Add guests"
                className="w-full bg-transparent outline-none text-sm placeholder:text-lead/30"
              />
            </div>
            <button
              type="submit"
              className="bg-brand text-brand-foreground px-8 py-3 rounded-[18px] font-medium text-sm ring-1 ring-brand"
            >
              Search Spaces
            </button>
          </form>
        </div>
      </section>

      <section className="py-16 border-t border-zinc-950/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-serif text-3xl">Featured Collections</h2>
            <Link
              to="/venues"
              className="text-sm font-medium border-b border-lead/10 hover:border-brand transition-colors"
            >
              View all venues
            </Link>
          </div>

          {!venues || venues.length === 0 ? (
            <EmptyFeatured />
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {venues.slice(0, 6).map((v, i) => (
                <Link
                  key={v.id}
                  to="/venues/$venueId"
                  params={{ venueId: v.id }}
                  className="group cursor-pointer"
                >
                  <div className="w-full aspect-[4/5] bg-stone-100 rounded-[12px] outline-1 -outline-offset-1 outline-black/5 mb-4 overflow-hidden">
                    <img
                      src={v.cover_image_url || fallbackImages[i % fallbackImages.length]}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading={i < 2 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-lg">{v.name}</h3>
                  </div>
                  <p className="text-sm text-lead/50 mb-3">
                    Up to {v.capacity} guests · {formatAddress(v.address_data)}
                  </p>
                  <p className="text-sm font-medium">
                    From {formatMoney(v.base_price_cents, v.currency)}
                    <span className="text-lead/40 font-normal"> / hour</span>
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-white ring-1 ring-black/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Discover",
              body: "Browse curated venues for every occasion — weddings, conferences, parties, celebrations.",
            },
            {
              title: "Reserve",
              body: "Pick a date and time, apply coupons, and lock the space with a soft hold while you confirm.",
            },
            {
              title: "Celebrate",
              body: "Receive confirmation, host your event, and your space comes through as promised.",
            },
          ].map((s, i) => (
            <div key={s.title}>
              <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-3">
                Step {i + 1}
              </div>
              <h3 className="font-serif text-2xl mb-2">{s.title}</h3>
              <p className="text-sm text-lead/60">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function EmptyFeatured() {
  return (
    <div className="bg-white ring-1 ring-black/5 rounded-[20px] p-12 text-center">
      <h3 className="font-serif text-2xl mb-2">No venues listed yet</h3>
      <p className="text-sm text-lead/60 mb-6">Be the first to list a space and start hosting.</p>
      <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
        <Link to="/host/venues/new">List your venue</Link>
      </Button>
    </div>
  );
}
