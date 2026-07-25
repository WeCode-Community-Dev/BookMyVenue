import React from "react";
import { Switch } from "@/components/ui/switch";

const NotificationPreferencesCard = ({ settings, setSettings }) => {
  const notifications = [
    { key: "email", label: "Email Notifications" },
    { key: "sms", label: "SMS Notifications" },
    { key: "marketing", label: "Marketing Emails" },
    { key: "bookingUpdates", label: "Booking Updates" },
  ];

  const toggleNotification = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <div className="bg-white rounded-2xl border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>

      <div className="space-y-5">
        {notifications.map((item) => (
          <div key={item.key} className="flex justify-between items-center">
            <p>{item.label}</p>
            <Switch
              checked={Boolean(settings.notifications?.[item.key])}
              onCheckedChange={() => toggleNotification(item.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferencesCard;