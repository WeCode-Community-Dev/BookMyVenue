import FeaturedVenueCard from "../home/FeaturedVenueCard";
import EmptyState from "../common/EmptyState";
import VenueCardGrid from "./VenueCardGrid";

const VenueGrid = ({ venues, totalCount }) => {
  if (venues.length === 0) {
    return (
      <EmptyState
        title="No venues match your filters"
        description={
          totalCount > 0
            ? "Try a different city, category, or search term."
            : "Check back soon - new venues are added regularly."
        }
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-5 flex items-center justify-between gap-4 px-0">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{venues.length}</span>
          {totalCount !== venues.length ? ` of ${totalCount}` : ""} venue
          {venues.length !== 1 ? "s" : ""}
        </p>
      </div>

      <VenueCardGrid>
        {venues.map((venue) => (
          <FeaturedVenueCard key={venue._id} venue={venue} />
        ))}
      </VenueCardGrid>
    </div>
  );
};

export default VenueGrid;
