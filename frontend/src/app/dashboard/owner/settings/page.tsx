"use client";

import React, { useState } from "react";
import { Settings as GearIcon, Save, Shield, User, Bell } from "lucide-react";

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("Sarah");
  const [email, setEmail] = useState("sarah@bookmyvenue.com");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Settings</h1>
          <p className="mt-1.5 text-body-md text-text-muted">Configure your personal and portal preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-5">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <User className="h-5.5 w-5.5 text-primary-container" />
              <span>Profile Settings</span>
            </h3>

            {isSaved && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-label-sm font-semibold text-emerald-800">
                Changes saved successfully!
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-label-md text-on-surface font-semibold" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-white focus-ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md text-on-surface font-semibold" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-white focus-ring-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-[#582200] px-6 py-3 text-label-md font-bold text-white shadow-md hover:bg-[#3c2d26] transition-all"
            >
              <Save className="h-4.5 w-4.5" />
              <span>Save Changes</span>
            </button>
          </form>

          <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-4">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <Shield className="h-5.5 w-5.5 text-primary-container" />
              <span>Security</span>
            </h3>
            <p className="text-body-md text-text-muted">Manage your password, login metrics, and two-factor authentication.</p>
            <button className="rounded-full border border-border-subtle px-5 py-2.5 text-label-sm font-bold text-on-surface hover:bg-stone-50 transition-colors">
              Reset Password
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card h-max space-y-4">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-container" />
            <span>Alert Preferences</span>
          </h3>
          <div className="space-y-3">
            {[
              { label: "New inquiry requests", defaultChecked: true },
              { label: "Booking confirmations", defaultChecked: true },
              { label: "Payout transfers", defaultChecked: false },
            ].map((pref, i) => (
              <label key={i} className="flex items-center gap-2.5 text-label-md text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked={pref.defaultChecked}
                  className="peer h-4.5 w-4.5 rounded border border-border-subtle checked:bg-primary-container transition-all"
                />
                <span className="text-text-muted peer-checked:text-on-surface font-medium">{pref.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
