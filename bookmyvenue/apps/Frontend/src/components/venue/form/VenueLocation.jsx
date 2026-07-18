import {
  MapPin,
  Building2,
  Hash,
  Users,
} from "lucide-react";

function VenueLocation({
  formData,
  updateField,
  errors,
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Location & Capacity
        </h2>

        <p className="mt-2 text-gray-500">
          Help guests find your venue.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Address */}

        <div className="md:col-span-2">
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <MapPin
              size={18}
              className="text-red-600"
            />
            Address
          </label>

          <input
            type="text"
            placeholder="Street address"
            value={formData.address_line}
            onChange={(e) =>
              updateField(
                "address_line",
                e.target.value
              )
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              errors.address_line
                ? "border-red-500"
                : "border-gray-300 focus:border-red-500"
            }`}
          />

          {errors.address_line && (
            <p className="mt-2 text-sm text-red-600">
              {errors.address_line}
            </p>
          )}
        </div>

        {/* City */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <Building2
              size={18}
              className="text-red-600"
            />
            City
          </label>

          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) =>
              updateField(
                "city",
                e.target.value
              )
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              errors.city
                ? "border-red-500"
                : "border-gray-300 focus:border-red-500"
            }`}
          />

          {errors.city && (
            <p className="mt-2 text-sm text-red-600">
              {errors.city}
            </p>
          )}
        </div>

        {/* Pincode */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <Hash
              size={18}
              className="text-red-600"
            />
            Pincode
          </label>

          <input
            type="text"
            maxLength={6}
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) =>
              updateField(
                "pincode",
                e.target.value
              )
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              errors.pincode
                ? "border-red-500"
                : "border-gray-300 focus:border-red-500"
            }`}
          />

          {errors.pincode && (
            <p className="mt-2 text-sm text-red-600">
              {errors.pincode}
            </p>
          )}
        </div>

        {/* Capacity */}

        <div className="md:col-span-2">
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <Users
              size={18}
              className="text-red-600"
            />
            Capacity
          </label>

          <input
            type="number"
            min={1}
            placeholder="Maximum guests"
            value={formData.capacity}
            onChange={(e) =>
              updateField(
                "capacity",
                e.target.value
              )
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
              errors.capacity
                ? "border-red-500"
                : "border-gray-300 focus:border-red-500"
            }`}
          />

          {errors.capacity && (
            <p className="mt-2 text-sm text-red-600">
              {errors.capacity}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}

export default VenueLocation;