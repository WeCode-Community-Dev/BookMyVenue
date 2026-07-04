import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterVenue() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    venueName: "",
    venueType: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    capacity: "",
    price: "",
    description: "",
    images: null,
    amenities: [],
  });

  const amenitiesList = [
    "Parking",
    "Air Conditioning",
    "Catering",
    "WiFi",
    "Stage",
    "Generator",
    "Decoration",
    "Rooms",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({
        ...formData,
        images: files,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAmenity = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Venue Registered Successfully!");

    navigate("/owner/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10">

        <h1 className="text-4xl font-bold text-[#4a1625] mb-2">
          Register Your Venue
        </h1>

        <p className="text-gray-500 mb-8">
          Fill in the details below to list your venue on BookMyVenue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-semibold text-gray-700">
                Venue Name
              </label>

              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                required
                placeholder="Royal Palace Hall"
                className="mt-2 w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8b1e2d]"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Venue Type
              </label>

              <select
                name="venueType"
                value={formData.venueType}
                onChange={handleChange}
                required
                className="mt-2 w-full border rounded-xl p-3"
              >
                <option value="">Select Venue Type</option>
                <option>Banquet Hall</option>
                <option>Convention Center</option>
                <option>Resort</option>
                <option>Auditorium</option>
                <option>Outdoor Lawn</option>
                <option>Wedding Hall</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Owner Name
              </label>

              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="mt-2 w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-2 w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-2 w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Capacity
              </label>

              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="mt-2 w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Price Per Day (₹)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-2 w-full border rounded-xl p-3"
              />
            </div>

          </div>
                    {/* Address */}
          <div>
            <label className="font-semibold text-gray-700">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              className="mt-2 w-full border rounded-xl p-3 resize-none"
              placeholder="Enter the complete venue address"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-gray-700">
              Venue Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="mt-2 w-full border rounded-xl p-3 resize-none"
              placeholder="Describe your venue..."
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="font-semibold text-gray-700 block mb-4">
              Amenities
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenity(amenity)}
                  />

                  <span>{amenity}</span>
                </label>
              ))}

            </div>
          </div>

          {/* Upload Images */}
          <div>
            <label className="font-semibold text-gray-700">
              Upload Venue Images
            </label>

            <input
              type="file"
              multiple
              onChange={handleChange}
              className="mt-3 block w-full border rounded-xl p-3"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              className="bg-[#8b1e2d] hover:bg-[#6f1723] text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Register Venue
            </button>

            <button
              type="button"
              onClick={() => navigate("/owner/dashboard")}
              className="bg-gray-200 hover:bg-gray-300 px-8 py-3 rounded-xl font-semibold transition"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default RegisterVenue;