import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { venuesApi, type VenueSearchParams } from "@/api/venues";
import { useFilterStore } from "@/stores/filterStore";
import { VenueCard } from "./VenueCard";
import { Input, Label, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { VENUE_TYPES } from "@/lib/types";

export function VenueListPage() {
  const [searchParams] = useSearchParams();
  const filters = useFilterStore();
  const setFilters = useFilterStore((s) => s.set);

  // Debounce the free-text query so we don't fire one request per keystroke.
  const [debouncedQ, setDebouncedQ] = useState(filters.q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(filters.q), 350);
    return () => clearTimeout(t);
  }, [filters.q]);

  const params: VenueSearchParams = useMemo(
    () => ({
      q: debouncedQ || undefined,
      type: (filters.type || searchParams.get("type") || undefined) as
        | VenueSearchParams["type"]
        | undefined,
      min_price: filters.min_price ? Number(filters.min_price) : undefined,
      max_price: filters.max_price ? Number(filters.max_price) : undefined,
      min_capacity: filters.min_capacity
        ? Number(filters.min_capacity)
        : undefined,
      limit: 50,
    }),
    [debouncedQ, filters, searchParams],
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["venues", "search", params],
    queryFn: () => venuesApi.search(params),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Explore venues</h1>

      <div className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label>Search</Label>
          <Input
            placeholder="Name or address"
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value as never })}
          >
            <option value="">All</option>
            {VENUE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Min price/hr</Label>
          <Input
            type="number"
            value={filters.min_price}
            onChange={(e) => setFilters({ min_price: e.target.value })}
          />
        </div>
        <div>
          <Label>Max price/hr</Label>
          <Input
            type="number"
            value={filters.max_price}
            onChange={(e) => setFilters({ max_price: e.target.value })}
          />
        </div>
        <div>
          <Label>Min capacity</Label>
          <Input
            type="number"
            value={filters.min_capacity}
            onChange={(e) => setFilters({ min_capacity: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {data ? `${data.length} venue(s) found` : "Loading..."}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading venues...</p>
      ) : data && data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No venues match your filters.</p>
      )}
    </div>
  );
}
