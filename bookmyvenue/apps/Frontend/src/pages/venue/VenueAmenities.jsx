import {
  CheckCircle2,
  ShieldCheck,
  Info,
} from "lucide-react";

function VenueAmenities({ venue }) {
  if (!venue) return null;

  const amenities = Array.isArray(venue.amenities)
    ? venue.amenities
    : typeof venue.amenities === "string"
    ? venue.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-8">
      {/* Amenities */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-100 p-3">
            <CheckCircle2
              size={22}
              className="text-green-600"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Amenities
            </h2>

            <p className="text-gray-500">
              Everything included with this venue.
            </p>
          </div>
        </div>

        {amenities.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-red-300 hover:bg-red-50"
              >
                <CheckCircle2
                  size={18}
                  className="text-green-600"
                />

                <span className="font-medium text-gray-700">
                  {amenity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 p-6 text-gray-500">
            <Info size={20} />

            <span>
              No amenities have been listed for this
              venue.
            </span>
          </div>
        )}
      </section>

      {/* Cancellation Policy */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <ShieldCheck
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cancellation Policy
            </h2>

            <p className="text-gray-500">
              Please review before confirming your
              booking.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <p className="leading-8 text-gray-700">
            {venue.cancellation_policy?.trim()
              ? venue.cancellation_policy
              : "No cancellation policy has been provided by the venue owner."}
          </p>
        </div>
      </section>
    </div>
  );
}

export default VenueAmenities;