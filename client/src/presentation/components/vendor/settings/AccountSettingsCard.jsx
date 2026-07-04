import React from "react";
import { Input } from "@/components/ui/input";

const AccountSettingsCard = ({ settings, setSettings }) => {
  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          value={settings.email}
          onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
        />

        <Input
          value={settings.phone}
          onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
        />

        <select
          className="border rounded-lg p-2"
          value={settings.language}
          onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
        >
          <option>English</option>
          <option>Hindi</option>
        </select>

        <select
          className="border rounded-lg p-2"
          value={settings.timezone}
          onChange={(e) => setSettings((prev) => ({ ...prev, timezone: e.target.value }))}
        >
          <option>Asia/Kolkata</option>
          <option>UTC</option>
        </select>
      </div>
    </div>
  );
};

export default AccountSettingsCard;