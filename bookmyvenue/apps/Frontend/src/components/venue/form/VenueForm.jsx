import { useEffect, useState } from "react";

import VenueBasicInfo from "./VenueBasicInfo";
import VenueLocation from "./VenueLocation";
import VenuePricingForm from "./VenuePricingForm";
import VenueAmenitiesForm from "./VenueAmenitiesForm";
import VenueImages from "./VenueImages";

function VenueForm({
  mode = "create",
  initialData = null,
  categories = [],
  loading = false,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",

    category_id: "",

    address_line: "",
    city: "",
    pincode: "",

    capacity: "",

    supports_hourly: false,
    supports_daily: false,

    hourly_price: "",
    daily_price: "",

    amenities: [],

    cancellation_policy: "",

    image_urls: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      name: initialData.name || "",
      description: initialData.description || "",

      category_id: initialData.category_id || "",

      address_line:
        initialData.address_line || "",

      city: initialData.city || "",

      pincode: initialData.pincode || "",

      capacity:
        initialData.capacity || "",

      supports_hourly:
        initialData.supports_hourly,

      supports_daily:
        initialData.supports_daily,

      hourly_price:
        initialData.hourly_price || "",

      daily_price:
        initialData.daily_price || "",

            amenities:
        initialData.amenities
          ? Array.isArray(initialData.amenities)
            ? initialData.amenities
            : initialData.amenities.split(",").map((a) => a.trim())
          : [],

      cancellation_policy:
        initialData.cancellation_policy ||
        "",

      image_urls:
        initialData.images?.map(
          (img) => img.image_url
        ) || [],
    });
  }, [initialData]);

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

    function validate() {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name =
        "Venue name is required.";

    if (!formData.description.trim())
      newErrors.description =
        "Description is required.";

    if (!formData.category_id)
      newErrors.category_id =
        "Select a category.";

    if (!formData.address_line.trim())
      newErrors.address_line =
        "Address is required.";

    if (!formData.city.trim())
      newErrors.city =
        "City is required.";

    if (!formData.pincode.trim())
      newErrors.pincode =
        "Pincode is required.";

    if (!formData.capacity || Number(formData.capacity) <= 0)
      newErrors.capacity =
        "Capacity is required.";

    if (
      !formData.supports_hourly &&
      !formData.supports_daily
    )
      newErrors.booking =
        "Select at least one booking type.";

    if (
      formData.supports_hourly &&
      (!formData.hourly_price || Number(formData.hourly_price) <= 0)
    )
      newErrors.hourly_price =
        "Hourly price required.";

    if (
      formData.supports_daily &&
      (!formData.daily_price || Number(formData.daily_price) <= 0)
    )
      newErrors.daily_price =
        "Daily price required.";

    if (
      formData.image_urls.length === 0
    )
      newErrors.images =
        "Add at least one image.";

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      ...formData,

      amenities:
        formData.amenities.join(","),

      category_id: Number(formData.category_id),
      capacity: Number(formData.capacity),
    };

    if (payload.hourly_price) payload.hourly_price = Number(payload.hourly_price);
    else delete payload.hourly_price;

    if (payload.daily_price) payload.daily_price = Number(payload.daily_price);
    else delete payload.daily_price;

    await onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <VenueBasicInfo
        formData={formData}
        updateField={updateField}
        categories={categories}
        errors={errors}
      />

      <VenueLocation
        formData={formData}
        updateField={updateField}
        errors={errors}
      />

      <VenuePricingForm
        formData={formData}
        updateField={updateField}
        errors={errors}
      />

      <VenueAmenitiesForm
        formData={formData}
        updateField={updateField}
      />

      <VenueImages
        formData={formData}
        updateField={updateField}
        errors={errors}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-red-600 py-4 text-lg font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
      >
        {loading
          ? "Saving..."
          : mode === "create"
          ? "Create Venue"
          : "Update Venue"}
      </button>
    </form>
  );
}

export default VenueForm;