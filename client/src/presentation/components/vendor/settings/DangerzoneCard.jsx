import React from "react";
import { Button } from "@/components/ui/button";

const DangerZoneCard = () => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">

      <h2 className="text-xl font-semibold text-red-600 mb-3">
        Danger Zone
      </h2>

      <p className="text-gray-600 mb-4">
        Permanently delete your account and all associated data.
      </p>

      <Button variant="destructive">
        Delete Account
      </Button>

    </div>
  );
};

export default DangerZoneCard;