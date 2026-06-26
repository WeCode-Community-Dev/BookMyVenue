import { VenueGrid } from "@/components/venues/venue-grid";
import { VenuesPageHeader } from "@/components/venues/venues-page-header";
import { VenuesSummaryRow } from "@/components/venues/venues-summary-row";

export default function MyVenuesPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <VenuesPageHeader />
      <VenuesSummaryRow />
      <VenueGrid />
    </div>
  );
}
