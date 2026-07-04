import { useState } from "react";

const UserEditProfileForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
    dob: user.dob || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    pincode: user.pincode || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Date of Birth
            </label>

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Address */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Address
          </label>

          <textarea
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              State
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Pincode */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Pincode
          </label>

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600 transition"
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  );
};

export default UserEditProfileForm;