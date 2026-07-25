import React from "react";
import { Switch } from "@/components/ui/switch";

const SecuritySettingsCard = () => {
  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Security Settings
      </h2>

      <div className="space-y-6">

        <div className="flex justify-between items-center">

          <div>
            <p className="font-medium">
              Two-Factor Authentication
            </p>

            <p className="text-sm text-gray-500">
              Add extra security to your account
            </p>
          </div>

          <Switch />
        </div>

        <div>

          <label className="block mb-2 font-medium">
            Session Timeout
          </label>

          <select className="border rounded-lg p-2 w-full">

            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>Never</option>

          </select>

        </div>

      </div>

    </div>
  );
};

export default SecuritySettingsCard;