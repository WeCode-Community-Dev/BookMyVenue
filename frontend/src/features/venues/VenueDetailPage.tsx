import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { venuesApi } from "@/api/venues";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { venueTypeLabel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { BookingForm } from "@/features/bookings/BookingForm";

export function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue", id],
    queryFn: () => venuesApi.get(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (!venue)
    return (
      <p className="p-8 text-gray-500">
        Venue not found.{" "}
        <Link to="/venues" className="text-brand-500">
          Back to venues
        </Link>
      </p>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/venues" className="text-sm text-brand-500 hover:underline">
        &larr; Back to venues
      </Link>

      <div className="mt-4 h-64 rounded-lg bg-gradient-to-br from-brand-200 to-brand-50" />

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center gap-3">
            <Badge color="red">{venueTypeLabel(venue.type)}</Badge>
            <span className="text-sm text-gray-400">Cap {venue.capacity}</span>
          </div>
          <h1 className="text-3xl font-bold">{venue.name}</h1>
          <p className="mt-1 text-gray-500">{venue.address}</p>

          {venue.description && (
            <p className="mt-4 text-gray-700">{venue.description}</p>
          )}

          {venue.amenities.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 font-semibold">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card className="p-5">
            <p className="text-3xl font-bold text-brand-600">
              {formatCurrency(venue.price_per_hour)}
              <span className="text-sm font-normal text-gray-400">/hr</span>
            </p>

            {isAuthenticated && user?.role === "user" ? (
              <div className="mt-5">
                <h3 className="mb-3 font-semibold">Book this venue</h3>
                <BookingForm
                  venueId={venue.id}
                  pricePerHour={venue.price_per_hour}
                />
              </div>
            ) : !isAuthenticated ? (
              <div className="mt-5">
                <Link to="/login">
                  <Button className="w-full">Log in to book</Button>
                </Link>
              </div>
            ) : (
              <p className="mt-5 text-sm text-gray-500">
                Log in as a user to book this venue.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
