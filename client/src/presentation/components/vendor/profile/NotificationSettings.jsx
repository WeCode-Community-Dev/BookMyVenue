import React from "react";
import { Switch } from "@/components/ui/switch";

const NotificationSettings = ({ isEditing }) => {
  const settings = [
    "New Bookings",
    "Booking Cancellations",
    "Payment Received",
    "Weekly Reports",
    "New Reviews",
    "Marketing Promotions",
  ];

  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Notification Settings
      </h2>

      <div className="space-y-5">

        {settings.map((setting) => (
          <div
            key={setting}
            className="flex justify-between items-center"
          >
            <p className="font-medium">
              {setting}
            </p>

            <Switch
              defaultChecked
              disabled={!isEditing}
            />
          </div>
        ))}

      </div>

      {!isEditing && (
        <p className="text-sm text-gray-400 mt-4">
          Click "Edit Profile" to modify notification preferences.
        </p>
      )}

    </div>
  );
};

export default NotificationSettings;