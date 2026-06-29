import React from "react";
import { Input } from "@/components/ui/input";

const AccountSettingsCard = () => {
  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Account Settings
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <Input defaultValue="vendor@example.com" />

        <Input defaultValue="+91 9876543210" />

        <select className="border rounded-lg p-2">
          <option>English</option>
          <option>Hindi</option>
        </select>

        <select className="border rounded-lg p-2">
          <option>Asia/Kolkata</option>
          <option>UTC</option>
        </select>

      </div>

    </div>
  );
};

export default AccountSettingsCard;