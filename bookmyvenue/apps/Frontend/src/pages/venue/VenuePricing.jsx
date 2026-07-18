import { Clock3, CalendarDays, BadgeIndianRupee } from "lucide-react";

function VenuePricing({ venue }) {
  if (!venue) return null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-red-100 p-3">
          <BadgeIndianRupee
            size={24}
            className="text-red-600"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pricing
          </h2>

          <p className="text-gray-500">
            Transparent pricing with no hidden charges.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {venue.supports_hourly && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Clock3
                    size={18}
                    className="text-red-600"
                  />

                  <span className="font-semibold text-gray-900">
                    Hourly Booking
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Perfect for short events and meetings.
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">
                  ₹{venue.hourly_price}
                </div>

                <div className="text-sm text-gray-500">
                  / hour
                </div>
              </div>
            </div>
          </div>
        )}

        {venue.supports_daily && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="font-semibold text-gray-900">
                    Daily Booking
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Best value for full-day events.
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ₹{venue.daily_price}
                </div>

                <div className="text-sm text-gray-500">
                  / day
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!venue.supports_hourly &&
        !venue.supports_daily && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Pricing information is currently unavailable.
          </div>
        )}
    </section>
  );
}

export default VenuePricing;