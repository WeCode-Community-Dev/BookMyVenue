import { OwnerStatCards } from "@/components/common/owner-stat-cards";
import { VenueGrid } from "@/components/venues/venue-grid";
import { VenuesPageHeader } from "@/components/venues/venues-page-header";

export default function MyVenuesPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <VenuesPageHeader />
      <OwnerStatCards isIconVisible={false} />
      <VenueGrid />
    </div>
  );
}
