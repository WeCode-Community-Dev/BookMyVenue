import React from "react";
import { Button } from "@/components/ui/button";

const ProfileHeader = ({
  profile,
  isEditing,
  setIsEditing,
}) => {
  const initials =
    profile?.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "--";

  return (
    <div className="bg-gradient-to-r from-amber-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white text-amber-600 flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {profile?.fullName || "-"}
            </h2>

            <p className="text-amber-100">
              Venue Owner
            </p>

            <p className="text-amber-100 text-sm">
              {profile?.email || "-"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;