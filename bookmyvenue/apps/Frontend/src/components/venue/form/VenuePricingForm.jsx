import {
  Clock3,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

function VenuePricingForm({
  formData,
  updateField,
  errors,
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Booking & Pricing
        </h2>

        <p className="mt-2 text-gray-500">
          Choose how guests can book your venue and
          set the pricing.
        </p>
      </div>

      {/* Booking Type */}

      <div className="grid gap-4 md:grid-cols-2">

        {/* Hourly */}

        <button
          type="button"
          onClick={() =>
            updateField(
              "supports_hourly",
              !formData.supports_hourly
            )
          }
          className={`rounded-2xl border p-6 text-left transition ${
            formData.supports_hourly
              ? "border-red-600 bg-red-50"
              : "border-gray-300 hover:border-red-400"
          }`}
        >
          <Clock3
            size={28}
            className="mb-4 text-red-600"
          />

          <h3 className="font-semibold text-lg">
            Hourly Booking
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Perfect for meetings, sports and
            short events.
          </p>
        </button>

        {/* Daily */}

        <button
          type="button"
          onClick={() =>
            updateField(
              "supports_daily",
              !formData.supports_daily
            )
          }
          className={`rounded-2xl border p-6 text-left transition ${
            formData.supports_daily
              ? "border-red-600 bg-red-50"
              : "border-gray-300 hover:border-red-400"
          }`}
        >
          <CalendarDays
            size={28}
            className="mb-4 text-red-600"
          />

          <h3 className="font-semibold text-lg">
            Daily Booking
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Best for weddings, parties and
            conferences.
          </p>
        </button>

      </div>

      {errors.booking && (
        <p className="mt-3 text-sm text-red-600">
          {errors.booking}
        </p>
      )}

      {/* Prices */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {formData.supports_hourly && (
          <div>
            <label className="mb-2 flex items-center gap-2 font-medium">
              <IndianRupee
                size={18}
                className="text-red-600"
              />
              Hourly Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price per hour"
              value={formData.hourly_price}
              onChange={(e) =>
                updateField(
                  "hourly_price",
                  e.target.value
                )
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                errors.hourly_price
                  ? "border-red-500"
                  : "border-gray-300 focus:border-red-500"
              }`}
            />

            {errors.hourly_price && (
              <p className="mt-2 text-sm text-red-600">
                {errors.hourly_price}
              </p>
            )}
          </div>
        )}

        {formData.supports_daily && (
          <div>
            <label className="mb-2 flex items-center gap-2 font-medium">
              <IndianRupee
                size={18}
                className="text-red-600"
              />
              Daily Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price per day"
              value={formData.daily_price}
              onChange={(e) =>
                updateField(
                  "daily_price",
                  e.target.value
                )
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                errors.daily_price
                  ? "border-red-500"
                  : "border-gray-300 focus:border-red-500"
              }`}
            />

            {errors.daily_price && (
              <p className="mt-2 text-sm text-red-600">
                {errors.daily_price}
              </p>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

export default VenuePricingForm;