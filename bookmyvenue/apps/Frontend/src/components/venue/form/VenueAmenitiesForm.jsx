import { useState } from "react";
import {
  Plus,
  X,
  ListChecks,
  ShieldCheck,
} from "lucide-react";

function VenueAmenitiesForm({
  formData,
  updateField,
}) {
  const [amenity, setAmenity] = useState("");

  function addAmenity() {
    const value = amenity.trim();

    if (!value) return;

    if (
      formData.amenities.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      )
    ) {
      setAmenity("");
      return;
    }

    updateField("amenities", [
      ...formData.amenities,
      value,
    ]);

    setAmenity("");
  }

  function removeAmenity(index) {
    updateField(
      "amenities",
      formData.amenities.filter(
        (_, i) => i !== index
      )
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Amenities & Policies
        </h2>

        <p className="mt-2 text-gray-500">
          Tell guests what your venue offers.
        </p>
      </div>

      {/* Amenities */}

      <div>

        <label className="mb-3 flex items-center gap-2 font-medium">
          <ListChecks
            size={18}
            className="text-red-600"
          />

          Amenities
        </label>

        <div className="flex gap-3">

          <input
            type="text"
            value={amenity}
            placeholder="e.g. WiFi"
            onChange={(e) =>
              setAmenity(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500"
          />

          <button
            type="button"
            onClick={addAmenity}
            className="rounded-xl bg-red-600 px-5 text-white transition hover:bg-red-700"
          >
            <Plus size={20} />
          </button>

        </div>

        {formData.amenities.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">

            {formData.amenities.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                >
                  {item}

                  <button
                    type="button"
                    onClick={() =>
                      removeAmenity(index)
                    }
                  >
                    <X size={16} />
                  </button>
                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* Cancellation Policy */}

      <div className="mt-8">

        <label className="mb-3 flex items-center gap-2 font-medium">
          <ShieldCheck
            size={18}
            className="text-red-600"
          />

          Cancellation Policy
        </label>

        <textarea
          rows={5}
          placeholder="Describe your cancellation policy..."
          value={
            formData.cancellation_policy
          }
          onChange={(e) =>
            updateField(
              "cancellation_policy",
              e.target.value
            )
          }
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500"
        />

      </div>

    </section>
  );
}

export default VenueAmenitiesForm;