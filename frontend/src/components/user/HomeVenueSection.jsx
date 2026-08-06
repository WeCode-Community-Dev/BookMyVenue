import { Link } from "react-router-dom";
import VenueCard from "./HomeVenueCard.jsx";

export default function HomeVenueSection({
  title,
  venues,
  showAllLink = "/venue",
}) {
  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <Link
          to={showAllLink}
          className="text-sm font-medium text-red-600 transition hover:text-red-700"
        >
          Show All →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {venues.map((venue) => (
          <VenueCard
            key={venue._id}
            venue={venue}
          />
        ))}
      </div>
    </section>
  );
}