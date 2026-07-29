import  { useState } from "react";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import SettingsHeader from "@/presentation/components/vendor/settings/SettingsHeader";
import AccountSettingsCard from "@/presentation/components/vendor/settings/AccountSettingsCard";
import NotificationPreferencesCard from "@/presentation/components/vendor/settings/NotificationPreferencesCard";
import SecuritySettingsCard from "@/presentation/components/vendor/settings/SecuritySettingsCard";
import DangerZoneCard from "@/presentation/components/vendor/settings/DangerZoneCard";
import SettingsActions from "@/presentation/components/vendor/settings/SettingsActions";
import SessionManagementCard from "@/presentation/components/vendor/settings/SessionManagementCard";

const Settings = () => {
  const [settings, setSettings] = useState({
    email: "vendor@example.com",
    phone: "+91 9876543210",
    language: "English",
    timezone: "Asia/Kolkata",
    notifications: {
      email: true,
      sms: true,
      marketing: false,
      bookingUpdates: true,
    },
  });

  const handleReset = () => {
    setSettings({
      email: "vendor@example.com",
      phone: "+91 9876543210",
      language: "English",
      timezone: "Asia/Kolkata",
      notifications: {
        email: true,
        sms: true,
        marketing: false,
        bookingUpdates: true,
      },
    });
  };

  const handleSave = () => {
    console.log("Saved settings", settings);
    alert("Settings saved successfully");
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <SettingsHeader />

          <AccountSettingsCard settings={settings} setSettings={setSettings} />
          <NotificationPreferencesCard settings={settings} setSettings={setSettings} />
          <SecuritySettingsCard />
          <SessionManagementCard />
          <DangerZoneCard />
          <SettingsActions onReset={handleReset} onSave={handleSave} />
        </main>
      </div>
    </div>
  );
};

export default Settings;