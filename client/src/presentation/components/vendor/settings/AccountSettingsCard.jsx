import React from "react";
import { Input } from "@/components/ui/input";

const AccountSettingsCard = ({ settings, setSettings }) => {
const handleChange = (field, value) => {
setSettings((prev) => ({
...prev,
[field]: value,
}));
};

return ( <div className="bg-white rounded-2xl border p-6 mb-6"> <h2 className="text-xl font-semibold mb-6">
Account Settings </h2>

```
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-2">
        Email
      </label>

      <Input
        type="email"
        value={settings.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Phone
      </label>

      <Input
        type="tel"
        value={settings.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        placeholder="Enter your phone number"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Language
      </label>

      <select
        className="w-full border rounded-lg p-2"
        value={settings.language}
        onChange={(e) => handleChange("language", e.target.value)}
      >
        <option value="English">English</option>
        <option value="Hindi">Hindi</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Timezone
      </label>

      <select
        className="w-full border rounded-lg p-2"
        value={settings.timezone}
        onChange={(e) => handleChange("timezone", e.target.value)}
      >
        <option value="Asia/Kolkata">Asia/Kolkata</option>
        <option value="UTC">UTC</option>
      </select>
    </div>
  </div>
</div>


);
};

export default AccountSettingsCard;
