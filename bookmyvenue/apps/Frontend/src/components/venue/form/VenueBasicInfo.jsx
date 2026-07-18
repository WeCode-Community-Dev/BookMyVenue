import { FileText, Tag, Type } from "lucide-react";

function VenueBasicInfo({
  formData,
  updateField,
  categories,
  errors,
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Basic Information
        </h2>

        <p className="mt-2 text-gray-500">
          Tell people about your venue.
        </p>
      </div>

      <div className="space-y-6">
        {/* Venue Name */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <Type
              size={18}
              className="text-red-600"
            />
            Venue Name
          </label>

          <input
            type="text"
            placeholder="Enter venue name"
            value={formData.name}
            onChange={(e) =>
              updateField(
                "name",
                e.target.value
              )
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none transition
              ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-red-500"
              }`}
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <FileText
              size={18}
              className="text-red-600"
            />
            Description
          </label>

          <textarea
            rows={6}
            placeholder="Describe your venue..."
            value={formData.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none transition resize-none
              ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300 focus:border-red-500"
              }`}
          />

          {errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            <Tag
              size={18}
              className="text-red-600"
            />
            Category
          </label>

          <select
            value={formData.category_id}
            onChange={(e) =>
              updateField(
                "category_id",
                Number(e.target.value)
              )
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none transition
              ${
                errors.category_id
                  ? "border-red-500"
                  : "border-gray-300 focus:border-red-500"
              }`}
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {errors.category_id && (
            <p className="mt-2 text-sm text-red-600">
              {errors.category_id}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default VenueBasicInfo;