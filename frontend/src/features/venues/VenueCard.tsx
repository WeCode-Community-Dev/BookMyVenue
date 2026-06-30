import { Link } from "react-router-dom";
import { Card, Badge } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { venueTypeLabel, type Venue } from "@/lib/types";

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link to={`/venues/${venue.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50" />
        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <Badge color="red">{venueTypeLabel(venue.type)}</Badge>
            {venue.distance_km != null && (
              <span className="text-xs text-gray-400">
                {venue.distance_km} km away
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">{venue.name}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">{venue.address}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-brand-600">
              {formatCurrency(venue.price_per_hour)}
              <span className="text-xs font-normal text-gray-400">/hr</span>
            </span>
            <span className="text-xs text-gray-500">Cap {venue.capacity}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
