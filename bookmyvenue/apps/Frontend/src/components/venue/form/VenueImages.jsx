import { useState } from "react";
import {
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";

function VenueImages({
  formData,
  updateField,
  errors,
}) {
  const [imageUrl, setImageUrl] =
    useState("");

  function addImage() {
    const url = imageUrl.trim();

    if (!url) return;

    if (
      formData.image_urls.includes(url)
    ) {
      setImageUrl("");
      return;
    }

    updateField("image_urls", [
      ...formData.image_urls,
      url,
    ]);

    setImageUrl("");
  }

  function removeImage(index) {
    updateField(
      "image_urls",
      formData.image_urls.filter(
        (_, i) => i !== index
      )
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addImage();
    }
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Venue Images
        </h2>

        <p className="mt-2 text-gray-500">
          Add one or more image URLs for your venue.
        </p>
      </div>

      {/* Add URL */}

      <div className="flex gap-3">

        <input
          type="url"
          value={imageUrl}
          placeholder="https://example.com/image.jpg"
          onChange={(e) =>
            setImageUrl(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500"
        />

        <button
          type="button"
          onClick={addImage}
          className="rounded-xl bg-red-600 px-5 text-white transition hover:bg-red-700"
        >
          <Plus size={20} />
        </button>

      </div>

      {errors.images && (
        <p className="mt-3 text-sm text-red-600">
          {errors.images}
        </p>
      )}

      {/* Image Preview */}

      {formData.image_urls.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {formData.image_urls.map(
            (url, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="aspect-video bg-gray-100">

                  <img
                    src={url}
                    alt={`Venue ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display =
                        "none";
                    }}
                  />

                </div>

                <div className="p-4">

                  <div className="mb-3 flex items-center gap-2 text-gray-600">

                    <ImagePlus size={18} />

                    <span className="truncate text-sm">
                      {url}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2 font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={18} />

                    Remove
                  </button>

                </div>
              </div>
            )
          )}

        </div>
      )}

    </section>
  );
}

export default VenueImages;