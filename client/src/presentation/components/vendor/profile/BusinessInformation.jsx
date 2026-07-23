import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BusinessInformation = ({
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

  const updateAddress = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  return (
    <div className="mb-6 rounded-2xl border bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Business Information
      </h2>

      {!isEditing ? (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">
              Company Name
            </p>

            <p className="font-medium">
              {profile.companyName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Address Line
            </p>

            <p className="font-medium">
              {profile.address?.addressLine1 || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              City
            </p>

            <p className="font-medium">
              {profile.address?.city || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              State
            </p>

            <p className="font-medium">
              {profile.address?.state || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Pincode
            </p>

            <p className="font-medium">
              {profile.address?.pincode || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Bio
            </p>

            <p className="font-medium">
              {profile.bio || "-"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            placeholder="Company Name"
            value={profile.companyName || ""}
            onChange={(e) =>
              updateField("companyName", e.target.value)
            }
          />

          <Input
            placeholder="Address Line"
            value={profile.address?.addressLine1 || ""}
            onChange={(e) =>
              updateAddress("addressLine1", e.target.value)
            }
          />

          <Input
            placeholder="City"
            value={profile.address?.city || ""}
            onChange={(e) =>
              updateAddress("city", e.target.value)
            }
          />

          <Input
            placeholder="State"
            value={profile.address?.state || ""}
            onChange={(e) =>
              updateAddress("state", e.target.value)
            }
          />

          <Input
            placeholder="Pincode"
            value={profile.address?.pincode || ""}
            onChange={(e) =>
              updateAddress("pincode", e.target.value)
            }
          />

          <Textarea
            placeholder="Bio"
            rows={5}
            value={profile.bio || ""}
            onChange={(e) =>
              updateField("bio", e.target.value)
            }
          />
        </div>
      )}
    </div>
  );
};

export default BusinessInformation;