import { Loader2, AlertCircle, ChevronRight } from "lucide-react";
import VenueCard from "../venue/VenueCard";

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

function VenueGrid({ venues, loading, error, emptyMessage }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-12">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
        <p className="text-sm text-gray-500">{emptyMessage || "No venues available yet."}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}

function LoadMoreButton({ visible, total, onClick }) {
  if (visible >= total) return null;

  return (
    <div className="mt-6 text-center">
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
      >
        Load more ({visible} of {total})
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function HomepageSections({
  loading,
  error,
  topRatedVenues,
  recentlyAddedVenues,
  categorySections,
  visibleTopRated = 4,
  visibleRecent = 4,
  visibleCategoryCounts = {},
  onLoadMore,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        <p className="mt-4 text-sm font-medium text-gray-600">
          Loading venues…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-20">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="mt-4 text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  const hasContent =
    (topRatedVenues && topRatedVenues.length > 0) ||
    (recentlyAddedVenues && recentlyAddedVenues.length > 0) ||
    (categorySections && categorySections.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <div className="space-y-16">
      {/* Top Rated */}
      {topRatedVenues && topRatedVenues.length > 0 && (
        <section>
          <SectionHeader
            title="Top Rated Venues"
            subtitle="Our most loved spaces, chosen by the community."
          />
          <VenueGrid
            venues={topRatedVenues.slice(0, visibleTopRated)}
            emptyMessage="No top-rated venues yet."
          />
          <LoadMoreButton
            visible={visibleTopRated}
            total={topRatedVenues.length}
            onClick={() => onLoadMore?.("topRated")}
          />
        </section>
      )}

      {/* Recently Added */}
      {recentlyAddedVenues && recentlyAddedVenues.length > 0 && (
        <section>
          <SectionHeader
            title="Just Added"
            subtitle="Fresh new venues ready for your next event."
          />
          <VenueGrid
            venues={recentlyAddedVenues.slice(0, visibleRecent)}
            emptyMessage="No recently added venues yet."
          />
          <LoadMoreButton
            visible={visibleRecent}
            total={recentlyAddedVenues.length}
            onClick={() => onLoadMore?.("recentlyAdded")}
          />
        </section>
      )}

      {/* Category Sections */}
      {categorySections && categorySections.length > 0 && (
        <div className="space-y-12">
          {categorySections.map((section, idx) => {
            const catId = section.category?.id || idx;
            const catName = section.category?.name || "Category";
            const venues = section.venues || [];
            const visibleCount = visibleCategoryCounts[catId] || 4;

            return (
              <section key={catId}>
                <SectionHeader
                  title={catName}
                  subtitle="Explore venues in this category."
                />
                <VenueGrid
                  venues={venues.slice(0, visibleCount)}
                  emptyMessage={`No venues in ${catName} yet.`}
                />
                <LoadMoreButton
                  visible={visibleCount}
                  total={venues.length}
                  onClick={() => onLoadMore?.("category", catId)}
                />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HomepageSections;