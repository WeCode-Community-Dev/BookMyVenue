import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BusinessInformation = ({ isEditing, profile, setProfile }) => {
  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Business Information</h2>

      {!isEditing ? (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">GST Number</p>
            <p className="font-medium">{profile.gstNumber || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Registration Number</p>
            <p className="font-medium">{profile.registrationNumber || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Website</p>
            <p className="font-medium">{profile.websiteUrl || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Business Description</p>
            <p className="font-medium">{profile.description || "-"}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input value={profile.gstNumber || ""} onChange={(e) => updateField("gstNumber", e.target.value)} />
          <Input value={profile.registrationNumber || ""} onChange={(e) => updateField("registrationNumber", e.target.value)} />
          <Input value={profile.websiteUrl || ""} onChange={(e) => updateField("websiteUrl", e.target.value)} />
          <Textarea value={profile.description || ""} onChange={(e) => updateField("description", e.target.value)} rows={5} />
        </div>
      )}
    </div>
  );
};

export default BusinessInformation;