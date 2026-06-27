import { useParams } from "react-router-dom";
import { MapPinIcon, UsersIcon, ClockIcon } from "lucide-react";
import Navbar from "@/components/navbar";
import ReserveDialog from "@/components/reserve-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useVenue } from "@/hooks/use-venue";
import { VENUE_TYPE_LABELS } from "@/types/venue.types";

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(mins).padStart(2, "0")} ${period}`;
};

const VenueDetails = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const { data: venue, isLoading, isError } = useVenue(venueId ?? "");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : isError || !venue ? (
          <p className="py-16 text-center text-muted-foreground">Venue not found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {venue.images?.length ? (
              <div className="grid auto-rows-[180px] grid-cols-2 gap-2 sm:grid-cols-4">
                {venue.images.map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt={venue.name}
                    className={`h-full w-full rounded-xl object-cover ${
                      index === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl bg-muted" />
            )}

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 flex flex-col gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    {VENUE_TYPE_LABELS[venue.venueType]}
                  </span>
                  <h1 className="text-3xl font-semibold">{venue.name}</h1>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {(venue.address || venue.city) && (
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="size-4" />
                      {[venue.address, venue.city].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {venue.capacity && (
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="size-4" />
                      Up to {venue.capacity} guests
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="size-4" />
                    {formatTime(venue.openingTime)} – {formatTime(venue.closingTime)}
                  </span>
                </div>

                {venue.description && (
                  <p className="text-sm leading-relaxed text-foreground">{venue.description}</p>
                )}

                {venue.amenities?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-medium">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardContent className="flex flex-col gap-4 py-6">
                    <div>
                      <span className="text-2xl font-semibold">₹{venue.pricePerHour}</span>
                      <span className="text-sm text-muted-foreground"> / hour</span>
                    </div>
                    <Separator />
                    <ReserveDialog venue={venue} />
                    <p className="text-center text-xs text-muted-foreground">
                      You won&apos;t be charged yet
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VenueDetails;
