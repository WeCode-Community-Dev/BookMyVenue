import { useEffect, useState } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { Link } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVenues } from "@/hooks/use-venue";
import { VENUE_TYPES, VENUE_TYPE_LABELS } from "@/types/venue.types";

const ALL_TYPES = "ALL";

const VenueList = () => {
  const [city, setCity] = useQueryState("city", { defaultValue: "", clearOnDefault: true });
  const [venueType, setVenueType] = useQueryState("venueType", {
    defaultValue: ALL_TYPES,
    clearOnDefault: true,
  });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [searchInput, setSearchInput] = useState(city);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== city) {
        setCity(searchInput || null);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, city, setCity, setPage]);

  useEffect(() => {
    setSearchInput(city);
  }, [city]);

  const { data, isLoading } = useVenues({
    page,
    city: city || undefined,
    venueType: venueType === ALL_TYPES ? undefined : venueType,
  });

  const venues = data?.venues ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Browse venues</h1>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search by city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select
            value={venueType}
            onValueChange={(value) => {
              setVenueType(value);
              setPage(1);
            }}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TYPES}>All types</SelectItem>
              {VENUE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {VENUE_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        ) : venues.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No venues found.</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <Link key={venue._id} to={`/venues/${venue._id}`}>
                  <Card className="h-full overflow-hidden pt-0 gap-0 transition hover:shadow-md">
                    {venue.images?.[0] ? (
                      <img
                        src={venue.images[0]}
                        alt={venue.name}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="h-44 w-full bg-muted" />
                    )}
                    <CardHeader className="pt-4">
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-1 pb-4 text-sm text-muted-foreground">
                      <span>{VENUE_TYPE_LABELS[venue.venueType]}</span>
                      {venue.city && <span>{venue.city}</span>}
                      <span className="font-medium text-foreground">
                        ₹{venue.pricePerHour}/hour
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default VenueList;
