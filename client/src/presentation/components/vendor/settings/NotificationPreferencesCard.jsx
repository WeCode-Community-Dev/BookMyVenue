import React from "react";
import { Switch } from "@/components/ui/switch";

const NotificationPreferencesCard = () => {
  const notifications = [
    "Email Notifications",
    "SMS Notifications",
    "Marketing Emails",
    "Booking Updates",
  ];

  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">

      <h2 className="text-xl font-semibold mb-6">
        Notification Preferences
      </h2>

      <div className="space-y-5">

        {notifications.map((item) => (
          <div
            key={item}
            className="flex justify-between items-center"
          >
            <p>{item}</p>

            <Switch defaultChecked />
          </div>
        ))}

      </div>

    </div>
  );
};

export default NotificationPreferencesCard;