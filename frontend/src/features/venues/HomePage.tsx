import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { venuesApi } from "@/api/venues";
import { VenueCard } from "./VenueCard";
import { VENUE_TYPES } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["venues", "home"],
    queryFn: () => venuesApi.search({ limit: 6 }),
  });

  return (
    <div>
      <section className="bg-brand-600 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold">
            Find & book the perfect nearby space
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-brand-50">
            Birthday halls, cafes, hotels, auditoriums and more — across anywhere.
          </p>
          <Link to="/venues">
            <Button size="lg" variant="secondary" className="mt-6">
              Explore venues
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-wrap gap-3">
          {VENUE_TYPES.map((t) => (
            <Link
              key={t.value}
              to={`/venues?type=${t.value}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:border-brand-500 hover:text-brand-500"
            >
              {t.label}
            </Link>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-bold">Featured venues</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : data && data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No venues available yet.</p>
        )}
      </section>
    </div>
  );
}
