import React from "react";
import { Button } from "@/components/ui/button";

const ProfileHeader = ({
  isEditing,
  setIsEditing,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">

          <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">
            AK
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Arjun Kapoor
            </h2>

            <p className="text-blue-100">
              Venue Owner
            </p>

            <p className="text-blue-100 text-sm">
              arjun@email.com
            </p>
          </div>

        </div>

        <Button
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