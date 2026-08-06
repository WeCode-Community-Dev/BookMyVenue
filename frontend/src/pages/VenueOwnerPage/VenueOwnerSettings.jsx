import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    Lock,
    Wallet,
    AlertTriangle,
    Eye,
    EyeOff,
    Check,
} from "lucide-react";

const OWNER_PROFILE = {
    name: "Sunil Kumar",
    email: "sunil.kumar@example.com",
    phone: "+91 98765 43210",
    businessName: "Kumar Hospitality Ventures",
};

const PAYOUT = {
    accountHolder: "Sunil Kumar",
    bankName: "HDFC Bank",
    accountNumber: "•••• •••• 4821",
    ifsc: "HDFC0001234",
};


function SectionCard({ title, description, children }) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
            <div className="mt-5">{children}</div>
        </section>
    );
}

function inputCls() {
    return "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100";
}

function Field({ label, icon: Icon, ...props }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                )}
                <input className={inputCls() + (Icon ? " pl-10" : "")} {...props} />
            </div>
        </div>
    );
}

function SavedToast({ show }) {
    if (!show) return null;
    return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check size={16} /> Saved
        </span>
    );
}


function ProfileSection() {
    const [form, setForm] = useState(OWNER_PROFILE);
    const [saved, setSaved] = useState(false);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    }

    function handleSave() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <SectionCard
            title="Profile Information"
            description="Update your personal and business details."
        >
            <div className="grid gap-5 md:grid-cols-2">
                <Field
                    label="Full Name"
                    icon={User}
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                <Field
                    label="Business Name"
                    icon={User}
                    value={form.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                />
                <Field
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
                <Field
                    label="Phone Number"
                    icon={Phone}
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
            </div>

            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                    Save Changes
                </button>
                <SavedToast show={saved} />
            </div>
        </SectionCard>
    );
}


function PasswordSection() {
    const [show, setShow] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });

    function handleSave() {
        setSaved(true);
        setForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <SectionCard
            title="Change Password"
            description="Use a strong password you don't use elsewhere."
        >
            <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Current Password
                    </label>
                    <div className="relative">
                        <Lock
                            size={18}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type={show ? "text" : "password"}
                            value={form.current}
                            onChange={(e) => setForm((p) => ({ ...p, current: e.target.value }))}
                            className={inputCls() + " pl-10 pr-10"}
                        />
                        <button
                            type="button"
                            onClick={() => setShow((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <Field
                    label="New Password"
                    icon={Lock}
                    type={show ? "text" : "password"}
                    value={form.next}
                    onChange={(e) => setForm((p) => ({ ...p, next: e.target.value }))}
                />
                <Field
                    label="Confirm New Password"
                    icon={Lock}
                    type={show ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                />
            </div>

            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                    Update Password
                </button>
                <SavedToast show={saved} />
            </div>
        </SectionCard>
    );
}

function ToggleRow({ title, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-red-600" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
            </button>
        </div>
    );
}

function NotificationsSection() {
    const [prefs, setPrefs] = useState({
        newBooking: true,
        bookingCancelled: true,
        venueApproved: true,
        payoutUpdates: true,
        marketingTips: false,
    });

    function set(key, value) {
        setPrefs((p) => ({ ...p, [key]: value }));
    }

    return (
        <SectionCard
            title="Notification Preferences"
            description="Choose what you'd like to be notified about by email."
        >
            <div className="divide-y divide-gray-100">
                <ToggleRow
                    title="New Booking"
                    description="When a customer books one of your venues."
                    checked={prefs.newBooking}
                    onChange={(v) => set("newBooking", v)}
                />
                <ToggleRow
                    title="Booking Cancelled"
                    description="When a customer cancels a confirmed booking."
                    checked={prefs.bookingCancelled}
                    onChange={(v) => set("bookingCancelled", v)}
                />
                <ToggleRow
                    title="Venue Approved / Rejected"
                    description="Updates on your venue listing review status."
                    checked={prefs.venueApproved}
                    onChange={(v) => set("venueApproved", v)}
                />
                <ToggleRow
                    title="Payout Updates"
                    description="When a payout is processed to your account."
                    checked={prefs.payoutUpdates}
                    onChange={(v) => set("payoutUpdates", v)}
                />
                <ToggleRow
                    title="Tips & Product Updates"
                    description="Occasional emails about new features and growth tips."
                    checked={prefs.marketingTips}
                    onChange={(v) => set("marketingTips", v)}
                />
            </div>
        </SectionCard>
    );
}

function PayoutSection() {
    return (
        <SectionCard
            title="Payout Details"
            description="The bank account your booking earnings are paid out to."
        >
            <div className="grid gap-5 md:grid-cols-2">
                <Field label="Account Holder Name" icon={User} defaultValue={PAYOUT.accountHolder} />
                <Field label="Bank Name" icon={Wallet} defaultValue={PAYOUT.bankName} />
                <Field label="Account Number" icon={Wallet} defaultValue={PAYOUT.accountNumber} />
                <Field label="IFSC Code" icon={Wallet} defaultValue={PAYOUT.ifsc} />
            </div>

            <div className="mt-6">
                <button className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50">
                    Update Payout Details
                </button>
            </div>
        </SectionCard>
    );
}

function DeleteAccountSection() {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const canDelete = confirmText.trim().toUpperCase() === "DELETE";

    return (
        <section className="rounded-xl border border-red-200 bg-red-50/40 p-6 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-red-100 p-2 text-red-600">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-red-700">Delete Account</h2>
                    <p className="mt-1 text-sm text-red-600/80">
                        This will permanently delete your venue owner account, all your venue
                        listings, and your booking history. This action cannot be undone.
                    </p>
                </div>
            </div>

            {!open ? (
                <div className="mt-5">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                        Delete My Account
                    </button>
                </div>
            ) : (
                <div className="mt-5 rounded-lg border border-red-200 bg-white p-4">
                    <p className="text-sm text-gray-700">
                        Type <span className="font-semibold text-red-600">DELETE</span> to
                        confirm. All 4 of your venues and their booking records will be
                        permanently removed.
                    </p>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE"
                        className="mt-3 w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            disabled={!canDelete}
                            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Permanently Delete Account
                        </button>
                        <button
                            onClick={() => {
                                setOpen(false);
                                setConfirmText("");
                            }}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}


export function VenueOwnerSettings() {
    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your profile, security, and account preferences.
                </p>
            </section>

            <ProfileSection />
            <PasswordSection />
            <NotificationsSection />
            <PayoutSection />
            <DeleteAccountSection />
        </div>
    );
}