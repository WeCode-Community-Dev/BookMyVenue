"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { User, Bell, Shield, Paintbrush, Save, Lock } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, login } = useApp();

  // Guard client authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  
  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [reminders, setReminders] = useState(true);

  const [saving, setSaving] = useState(false);

  // Sync state with context user
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Name and email are required fields.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      // Simulate profile persistence
      const updatedUser = {
        ...user,
        name: fullName,
        email: email,
        role: user?.role || "customer"
      };
      
      localStorage.setItem("bookmyvenue_user", JSON.stringify(updatedUser));
      // Re-login to update context state
      login(email, user?.role || "customer");
      
      setSaving(false);
      toast.success("Profile details updated successfully!");
    }, 800);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    }, 800);
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Notification preferences saved!");
    }, 500);
  };

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal profile, credentials, and message preference alerts.
          </p>
        </div>

        {/* Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Settings Tabs Sidebar */}
          <aside className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <User className="mr-3 h-4.5 w-4.5" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Bell className="mr-3 h-4.5 w-4.5" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Shield className="mr-3 h-4.5 w-4.5" />
              Password & Security
            </button>
          </aside>

          {/* Settings Viewport (Right 3 Columns) */}
          <main className="md:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm">
            
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Profile Details
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update your public name and email address connected to your reservations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-bold text-foreground">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-xl border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-foreground">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl border-border bg-background"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-primary text-primary-foreground font-bold flex items-center px-5 py-4 cursor-pointer"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    Notification Preferences
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure when and how you receive alerts about space approvals.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 text-sm text-foreground cursor-pointer">
                    <Checkbox
                      checked={emailAlerts}
                      onCheckedChange={(checked) => setEmailAlerts(!!checked)}
                      className="rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">Email Booking Updates</span>
                      <span className="text-xs text-muted-foreground">Receive approval receipt files directly in your mailbox.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 text-sm text-foreground cursor-pointer">
                    <Checkbox
                      checked={smsAlerts}
                      onCheckedChange={(checked) => setSmsAlerts(!!checked)}
                      className="rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">SMS Text Messages</span>
                      <span className="text-xs text-muted-foreground">Get instant notifications on your phone when a host responds.</span>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 text-sm text-foreground cursor-pointer">
                    <Checkbox
                      checked={reminders}
                      onCheckedChange={(checked) => setReminders(!!checked)}
                      className="rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold block">Reservation Reminders</span>
                      <span className="text-xs text-muted-foreground">Receive a 24-hour reminder email prior to your booked slot time.</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-primary text-primary-foreground font-bold flex items-center px-5 py-4 cursor-pointer"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    {saving ? "Saving Preferences..." : "Save Preferences"}
                  </Button>
                </div>
              </form>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-primary" />
                    Security Credentials
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Keep your account secure by rotating your login password credentials.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPass" className="text-xs font-bold text-foreground">Current Password</Label>
                    <Input
                      id="currentPass"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-xl border-border bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPass" className="text-xs font-bold text-foreground">New Password</Label>
                      <Input
                        id="newPass"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="rounded-xl border-border bg-background"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPass" className="text-xs font-bold text-foreground">Confirm New Password</Label>
                      <Input
                        id="confirmPass"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="rounded-xl border-border bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-primary text-primary-foreground font-bold flex items-center px-5 py-4 cursor-pointer"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    {saving ? "Updating Password..." : "Update Password"}
                  </Button>
                </div>
              </form>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
