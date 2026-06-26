import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { createVenue } from "../../api/venue";
import { getCategories } from "../../api/categories";

function CreateVenue() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    address_line: "",
    city: "",
    pincode: "",
    capacity: "",
    supports_hourly: false,
    hourly_price: "",
    supports_daily: false,
    daily_price: "",
    amenities: "",
    cancellation_policy: "",
  });

  const [imageUrls, setImageUrls] = useState([""]);

  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handlePincodeChange(event) {
    const value = event.target.value;

    if (value.length <= 6) {
      setFormData({
        ...formData,
        pincode: value,
      });
    }
  }

  function handleImageChange(index, value) {
    const updatedImages = [...imageUrls];
    updatedImages[index] = value;
    setImageUrls(updatedImages);
  }

  function addImageInput() {
    setImageUrls([...imageUrls, ""]);
  }

  function removeImageInput(index) {
    if (imageUrls.length === 1) {
      return;
    }

    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
  }

  function getErrorMessage(err) {
    const detail = err.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).join(", ");
    }

    return "Something went wrong. Please try again.";
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return "Venue name is required";
    }

    if (!formData.description.trim()) {
      return "Description is required";
    }

    if (!formData.category_id) {
      return "Please select a category";
    }

    if (!formData.address_line.trim()) {
      return "Address line is required";
    }

    if (!formData.city.trim()) {
      return "City is required";
    }

    if (!formData.pincode.trim()) {
      return "Pincode is required";
    }

    if (formData.pincode.length > 6) {
      return "Pincode cannot be more than 6 characters";
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      return "Capacity must be greater than 0";
    }

    if (!formData.supports_hourly && !formData.supports_daily) {
      return "Please select at least one pricing option: hourly or daily";
    }

    if (formData.supports_hourly) {
      if (!formData.hourly_price || Number(formData.hourly_price) <= 0) {
        return "Hourly price must be greater than 0";
      }
    }

    if (formData.supports_daily) {
      if (!formData.daily_price || Number(formData.daily_price) <= 0) {
        return "Daily price must be greater than 0";
      }
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const cleanedImageUrls = imageUrls
      .map((url) => url.trim())
      .filter((url) => url !== "");

    const venueData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category_id: Number(formData.category_id),
      address_line: formData.address_line.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      capacity: Number(formData.capacity),
      supports_hourly: formData.supports_hourly,
      hourly_price: formData.supports_hourly
        ? Number(formData.hourly_price)
        : null,
      supports_daily: formData.supports_daily,
      daily_price: formData.supports_daily
        ? Number(formData.daily_price)
        : null,
      amenities: formData.amenities.trim(),
      cancellation_policy: formData.cancellation_policy.trim() || null,
      image_urls: cleanedImageUrls,
    };

    try {
      setSubmitting(true);

      await createVenue(venueData, token);

      navigate("/owner/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Create Venue</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Venue Name</label>
            <br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <br />

          <div>
            <label>Description</label>
            <br />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <br />

          <div>
            <label>Category</label>
            <br />
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div>
            <label>Address Line</label>
            <br />
            <input
              type="text"
              name="address_line"
              value={formData.address_line}
              onChange={handleChange}
            />
          </div>

          <br />

          <div>
            <label>City</label>
            <br />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <br />

          <div>
            <label>Pincode</label>
            <br />
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handlePincodeChange}
              maxLength={6}
            />
          </div>

          <br />

          <div>
            <label>Capacity</label>
            <br />
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
            />
          </div>

          <br />

          <div>
            <label>
              <input
                type="checkbox"
                name="supports_hourly"
                checked={formData.supports_hourly}
                onChange={handleChange}
              />
              Supports Hourly
            </label>
          </div>

          {formData.supports_hourly && (
            <div>
              <label>Hourly Price</label>
              <br />
              <input
                type="number"
                name="hourly_price"
                value={formData.hourly_price}
                onChange={handleChange}
                min="1"
              />
            </div>
          )}

          <br />

          <div>
            <label>
              <input
                type="checkbox"
                name="supports_daily"
                checked={formData.supports_daily}
                onChange={handleChange}
              />
              Supports Daily
            </label>
          </div>

          {formData.supports_daily && (
            <div>
              <label>Daily Price</label>
              <br />
              <input
                type="number"
                name="daily_price"
                value={formData.daily_price}
                onChange={handleChange}
                min="1"
              />
            </div>
          )}

          <br />

          <div>
            <label>Amenities</label>
            <br />
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Parking, AC"
            />
          </div>

          <br />

          <div>
            <label>Cancellation Policy</label>
            <br />
            <textarea
              name="cancellation_policy"
              value={formData.cancellation_policy}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <br />

          <div>
            <label>Image URLs</label>

            {imageUrls.map((imageUrl, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(event) =>
                    handleImageChange(index, event.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />

                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageInput(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addImageInput}>
              Add another image
            </button>
          </div>

          <br />

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Venue"}
          </button>
        </form>
      )}
    </div>
  );
}

export default CreateVenue;