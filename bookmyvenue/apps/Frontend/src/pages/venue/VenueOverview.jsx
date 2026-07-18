import {
  MapPin,
  Users,
  Clock3,
  CalendarDays,
} from "lucide-react";

function VenueOverview({ venue }) {
  if (!venue) return null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {venue.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin
                size={18}
                className="text-red-600"
              />

              <span>
                {venue.address_line}, {venue.city},{" "}
                {venue.pincode}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users
                size={18}
                className="text-red-600"
              />

              <span>
                {venue.capacity} Guests
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {venue.supports_hourly && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
              <Clock3 size={16} />
              Hourly Booking
            </span>
          )}

          {venue.supports_daily && (
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <CalendarDays size={16} />
              Daily Booking
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          About this venue
        </h2>

        <p className="mt-4 leading-8 text-gray-600">
          {venue.description ||
            "No description available for this venue."}
        </p>
      </div>
    </section>
  );
}

export default VenueOverview;