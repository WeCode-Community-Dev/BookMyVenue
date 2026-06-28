import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const BookingsEmptyState = () => (
  <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center sm:py-16">
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
      <CalendarDays className="h-7 w-7" aria-hidden="true" />
    </span>

    <h2 className="mt-5 text-xl font-semibold text-gray-900">No bookings yet</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
      Your reservations will appear here once you book a venue. Browse venues to
      find your next event space.
    </p>

    <Link
      to="/venues"
      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-colors hover:bg-red-700"
    >
      Browse Venues
    </Link>
  </div>
);

export default BookingsEmptyState;
