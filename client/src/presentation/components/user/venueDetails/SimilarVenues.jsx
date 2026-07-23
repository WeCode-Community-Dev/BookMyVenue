import VenueCard from "@/presentation/components/common/VenueCard";

export default function SimilarVenues({ venues = [] }) {
  if (!venues.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Similar Venues
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            variant="home"
          />
        ))}
      </div>
    </section>
  );
}