import React from "react";
import { Input } from "@/components/ui/input";

const PersonalInformation = ({
  isEditing,
  profile,
  setProfile,
}) => {
  const updateField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Personal Information
      </h2>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="font-medium">
              {profile.fullName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email Address
            </p>

            <p className="font-medium">
              {profile.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone Number
            </p>

            <p className="font-medium">
              {profile.phone || "-"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <Input
              placeholder="Full Name"
              value={profile.fullName || ""}
              onChange={(e) =>
                updateField("fullName", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <Input
              type="email"
              value={profile.email || ""}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>

            <Input
              placeholder="Phone Number"
              value={profile.phone || ""}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;