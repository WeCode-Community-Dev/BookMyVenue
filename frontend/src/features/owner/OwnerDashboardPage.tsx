import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { venuesApi } from "@/api/venues";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VenueStatusBadge } from "@/components/StatusBadges";
import { venueTypeLabel } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function OwnerDashboardPage() {
  const { data: venues, isLoading } = useQuery({
    queryKey: ["owner-venues"],
    queryFn: venuesApi.ownerList,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <Link to="/owner/venues/new">
          <Button>+ List a venue</Button>
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <Link to="/owner">
          <Button variant="ghost" size="sm">My Venues</Button>
        </Link>
        <Link to="/owner/bookings">
          <Button variant="ghost" size="sm">Bookings</Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : venues && venues.length > 0 ? (
        <div className="grid gap-4">
          {venues.map((v) => (
            <Card key={v.id} className="flex items-center justify-between p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{v.name}</h3>
                  <VenueStatusBadge status={v.status} />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {venueTypeLabel(v.type)} · {v.address} · Cap {v.capacity}
                </p>
                <p className="mt-1 text-sm font-semibold text-brand-600">
                  {formatCurrency(v.price_per_hour)}/hr
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-gray-500">
          You haven't listed any venues yet.
          <div className="mt-3">
            <Link to="/owner/venues/new">
              <Button>List your first venue</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
