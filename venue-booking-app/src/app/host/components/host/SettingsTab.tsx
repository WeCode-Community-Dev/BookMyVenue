"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Users, CreditCard, Bell, Save } from "lucide-react";

export default function SettingsTab() {
  // Settings form states
  const [hostFirstName, setHostFirstName] = useState("Premium");
  const [hostLastName, setHostLastName] = useState("Venue Host");
  const [hostPhone, setHostPhone] = useState("+1 (555) 019-2834");
  const [hostRouting, setHostRouting] = useState("121000248");
  const [hostAccount, setHostAccount] = useState("••••••••4829");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPayouts, setNotifPayouts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile and payment settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-foreground">Dashboard Settings</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update host profile details, notification schedules, and banking payout routing.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Block */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-foreground flex items-center border-b border-border/60 pb-3">
            <Users className="h-4.5 w-4.5 text-primary mr-1.5" />
            Host Profile Specifications
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hostFirst" className="text-[11px] font-bold text-foreground">First Name</Label>
              <Input id="hostFirst" type="text" value={hostFirstName} onChange={(e) => setHostFirstName(e.target.value)} className="rounded-xl border-border bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hostLast" className="text-[11px] font-bold text-foreground">Last Name</Label>
              <Input id="hostLast" type="text" value={hostLastName} onChange={(e) => setHostLastName(e.target.value)} className="rounded-xl border-border bg-background" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hostPhone" className="text-[11px] font-bold text-foreground">Phone number</Label>
            <Input id="hostPhone" type="text" value={hostPhone} onChange={(e) => setHostPhone(e.target.value)} className="rounded-xl border-border bg-background" />
          </div>
        </div>

        {/* Bank Routing Block */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-foreground flex items-center border-b border-border/60 pb-3">
            <CreditCard className="h-4.5 w-4.5 text-primary mr-1.5" />
            Banking Payout Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hostRouting" className="text-[11px] font-bold text-foreground">ABA Routing Number</Label>
              <Input id="hostRouting" type="text" value={hostRouting} onChange={(e) => setHostRouting(e.target.value)} className="rounded-xl border-border bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hostAccount" className="text-[11px] font-bold text-foreground">Account Number</Label>
              <Input id="hostAccount" type="password" value={hostAccount} onChange={(e) => setHostAccount(e.target.value)} className="rounded-xl border-border bg-background" />
            </div>
          </div>
        </div>

        {/* Notifications scheduler checkboxes */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-foreground flex items-center border-b border-border/60 pb-3">
            <Bell className="h-4.5 w-4.5 text-primary mr-1.5" />
            Notification Toggles
          </h3>
          <div className="space-y-3 text-xs font-semibold text-muted-foreground select-none">
            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-foreground">
              <Checkbox checked={notifEmail} onCheckedChange={(c) => setNotifEmail(!!c)} className="rounded" />
              <span>Receive email notifications for pending booking inquiries.</span>
            </label>
            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-foreground">
              <Checkbox checked={notifSms} onCheckedChange={(c) => setNotifSms(!!c)} className="rounded" />
              <span>Receive text messages for confirmed reservation scheduling.</span>
            </label>
            <label className="flex items-center space-x-2.5 cursor-pointer hover:text-foreground">
              <Checkbox checked={notifPayouts} onCheckedChange={(c) => setNotifPayouts(!!c)} className="rounded" />
              <span>Send payout reports directly to bank account weekly.</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 flex items-center">
            <Save className="h-4 w-4 mr-1.5" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
