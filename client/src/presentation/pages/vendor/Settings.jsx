import React from "react";

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
  return (
    <div className="flex bg-slate-100 min-h-screen">

      <VendorSidebar />

      <div className="flex-1">

        <VendorNavbar />

        <main className="p-6">

          <SettingsHeader />

          <AccountSettingsCard />

          <NotificationPreferencesCard />

          <SecuritySettingsCard />
          <SessionManagementCard />

          <DangerZoneCard />

          <SettingsActions />

        </main>

      </div>

    </div>
  );
};

export default Settings;