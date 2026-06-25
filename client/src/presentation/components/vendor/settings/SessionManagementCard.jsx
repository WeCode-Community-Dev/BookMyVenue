import React from "react";
import { Button } from "@/components/ui/button";

const SessionManagementCard = () => {
  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Session Management
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between items-center border rounded-lg p-4">

          <div>
            <p className="font-medium">
              Current Session
            </p>

            <p className="text-sm text-gray-500">
              Chrome • Windows • Active Now
            </p>
          </div>

          <span className="text-green-600 font-medium">
            Active
          </span>

        </div>

        <div className="flex justify-between items-center border rounded-lg p-4">

          <div>
            <p className="font-medium">
              Mobile Device
            </p>

            <p className="text-sm text-gray-500">
              Android • Last active 2 hours ago
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
          >
            Revoke
          </Button>

        </div>

      </div>

      <div className="mt-6">

        <Button variant="destructive">
          Logout All Other Devices
        </Button>

      </div>

    </div>
  );
};

export default SessionManagementCard;