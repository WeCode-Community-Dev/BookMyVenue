import { useState } from "react";
import { X, CheckCircle2, ChevronDown, Upload, ChevronLeft, ChevronRight, Clock, Plus, Trash2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

interface Booking {
    id: string;
    client: string;
    venue: string;
    date: string;
    guests: number;
    amount: number;
    status: BookingStatus;
    category: string;
}

interface Venue {
    id: string;
    name: string;
    location: string;
    category: string;
    capacity: number;
    price: number;
    rating: number;
    bookings: number;
    status: "Active" | "Inactive";
    image: string;
}

interface Session {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    price: string;
}



const DISTRICTS = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
];

const CATEGORIES = [
    "Wedding",
    "Conference",
    "Birthday",
    "Corporate",
    "Party",
    "Cultural Event",
    "Exhibition",
    "Other",
];

const AMENITIES_LIST = [
    "AC",
    "Parking",
    "Catering",
    "Stage",
    "Sound System",
    "Projector",
    "Bridal Room",
    "Generator",
    "Wi-Fi",
    "Valet Parking",
];

const PRESET_SESSIONS = [
    { name: "Morning", startTime: "06:00", endTime: "12:00" },
    { name: "Afternoon", startTime: "12:00", endTime: "17:00" },
    { name: "Evening", startTime: "17:00", endTime: "22:00" },
    { name: "Full Day", startTime: "06:00", endTime: "22:00" },
];

const STEP_LABELS = ["Basic Details", "Amenities & Info", "Sessions"];

// ── Add Venue Form ─────────────────────────────────────────────────────────
function AddVenueModal({ onClose, onAdd }: { onClose: () => void; onAdd: (v: Venue) => void }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        location: "",
        category: "",
        capacity: "",
        price: "",
        description: "",
        address: "",
        amenities: [] as string[],
        sessions: [] as Session[],
    });
    const [newSession, setNewSession] = useState({ name: "", startTime: "", endTime: "", price: "" });
    const [sessionError, setSessionError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
    const toggleAmenity = (a: string) =>
        setForm((f) => ({
            ...f,
            amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
        }));

    const addPresetSession = (preset: (typeof PRESET_SESSIONS)[number]) => {
        const alreadyAdded = form.sessions.some((s) => s.name === preset.name);
        if (alreadyAdded) return;
        setForm((f) => ({
            ...f,
            sessions: [
                ...f.sessions,
                { id: Date.now().toString(), name: preset.name, startTime: preset.startTime, endTime: preset.endTime, price: "" },
            ],
        }));
    };

    const addCustomSession = () => {
        if (!newSession.name.trim()) { setSessionError("Session name is required"); return; }
        if (!newSession.startTime) { setSessionError("Start time is required"); return; }
        if (!newSession.endTime) { setSessionError("End time is required"); return; }
        if (newSession.startTime >= newSession.endTime) { setSessionError("End time must be after start time"); return; }
        setSessionError("");
        setForm((f) => ({
            ...f,
            sessions: [...f.sessions, { id: Date.now().toString(), ...newSession }],
        }));
        setNewSession({ name: "", startTime: "", endTime: "", price: "" });
    };

    const removeSession = (id: string) =>
        setForm((f) => ({ ...f, sessions: f.sessions.filter((s) => s.id !== id) }));

    const validate1 = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Venue name is required";
        if (!form.location) e.location = "District is required";
        if (!form.category) e.category = "Category is required";
        if (!form.capacity || isNaN(Number(form.capacity))) e.capacity = "Valid capacity required";
        if (!form.price || isNaN(Number(form.price))) e.price = "Valid price required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validate1()) setStep(2);
        else if (step === 2) setStep(3);
    };

    const handleBack = () => setStep((s) => s - 1);

    const handleSubmit = () => {
        const newVenue: Venue = {
            id: "v" + Date.now(),
            name: form.name,
            location: form.location,
            category: form.category,
            capacity: Number(form.capacity),
            price: Number(form.price),
            rating: 0,
            bookings: 0,
            status: "Active",
            image: "https://images.unsplash.com/photo-1763553113332-800519753e40?w=400&h=260&fit=crop&auto=format",
        };
        onAdd(newVenue);
        onClose();
    };

    const fmt12h = (t: string) => {
        if (!t) return "";
        const parts = t.split(":");
        const h = Number(parts[0]);
        const m = Number(parts[1]);
        const ampm = h >= 12 ? "PM" : "AM";
        return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-card w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-primary px-6 py-5 flex items-center justify-between shrink-0">
                    <div>
                        <h2
                            className="text-lg font-bold text-primary-foreground"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Add New Venue
                        </h2>
                        <p className="text-primary-foreground/60 text-xs mt-0.5">
                            Step {step} of 3 — {STEP_LABELS[step - 1]}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex bg-primary/5 border-b border-border shrink-0">
                    {STEP_LABELS.map((label, i) => (
                        <div
                            key={label}
                            className={`flex-1 py-3 text-center text-xs font-semibold transition-colors ${
                                step === i + 1
                                    ? "text-primary border-b-2 border-primary bg-background"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Venue Name */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1.5">
                                    Venue Name *
                                </label>
                                <input
                                    className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.name ? "border-red-400" : "border-border"}`}
                                    placeholder="e.g. The Royal Pavilion"
                                    value={form.name}
                                    onChange={(e) => set("name", e.target.value)}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* District + Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        District *
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring ${errors.location ? "border-red-400" : "border-border"}`}
                                            value={form.location}
                                            onChange={(e) => set("location", e.target.value)}
                                        >
                                            <option value="">Select district</option>
                                            {DISTRICTS.map((d) => (
                                                <option key={d}>{d}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                    {errors.location && (
                                        <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        Category *
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring ${errors.category ? "border-red-400" : "border-border"}`}
                                            value={form.category}
                                            onChange={(e) => set("category", e.target.value)}
                                        >
                                            <option value="">Select category</option>
                                            {CATEGORIES.map((c) => (
                                                <option key={c}>{c}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                    {errors.category && (
                                        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                                    )}
                                </div>
                            </div>

                            {/* Capacity + Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        Capacity (guests) *
                                    </label>
                                    <input
                                        type="number"
                                        className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.capacity ? "border-red-400" : "border-border"}`}
                                        placeholder="e.g. 500"
                                        value={form.capacity}
                                        onChange={(e) => set("capacity", e.target.value)}
                                    />
                                    {errors.capacity && (
                                        <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                                        Price / Session (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        className={`w-full px-4 py-2.5 bg-input-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.price ? "border-red-400" : "border-border"}`}
                                        placeholder="e.g. 25000"
                                        value={form.price}
                                        onChange={(e) => set("price", e.target.value)}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1.5">
                                    Full Address
                                </label>
                                <input
                                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Street, city, PIN code"
                                    value={form.address}
                                    onChange={(e) => set("address", e.target.value)}
                                />
                            </div>

                            {/* Photo upload placeholder */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1.5">
                                    Venue Photos
                                </label>
                                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                    <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Drag & drop photos or{" "}
                                        <span className="text-primary font-medium">browse</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        JPG, PNG up to 10MB each (max 20 photos)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1.5">
                                    Venue Description
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                    placeholder="Describe your venue — ambiance, unique features, nearby landmarks..."
                                    value={form.description}
                                    onChange={(e) => set("description", e.target.value)}
                                />
                            </div>

                            {/* Amenities */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Amenities
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {AMENITIES_LIST.map((a) => {
                                        const checked = form.amenities.includes(a);
                                        return (
                                            <button
                                                key={a}
                                                type="button"
                                                onClick={() => toggleAmenity(a)}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                                                    checked
                                                        ? "border-primary bg-primary/8 text-primary"
                                                        : "border-border bg-input-background text-foreground hover:border-primary/40"
                                                }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-primary border-primary" : "border-muted-foreground/40"}`}
                                                >
                                                    {checked && (
                                                        <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                                                    )}
                                                </div>
                                                {a}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5">
                            {/* Preset quick-add */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Quick Add Sessions
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PRESET_SESSIONS.map((p) => {
                                        const added = form.sessions.some((s) => s.name === p.name);
                                        return (
                                            <button
                                                key={p.name}
                                                type="button"
                                                onClick={() => addPresetSession(p)}
                                                disabled={added}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                                    added
                                                        ? "border-primary bg-primary/8 text-primary cursor-default"
                                                        : "border-border bg-input-background text-foreground hover:border-primary/40"
                                                }`}
                                            >
                                                <Clock className="w-4 h-4 shrink-0" />
                                                <span className="flex-1 text-left">{p.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {fmt12h(p.startTime)}–{fmt12h(p.endTime)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom session form */}
                            <div className="border border-border rounded-xl p-4 space-y-3 bg-secondary/30">
                                <p className="text-sm font-semibold text-foreground">Add Custom Session</p>
                                <input
                                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Session name (e.g. Night Gala)"
                                    value={newSession.name}
                                    onChange={(e) => setNewSession((s) => ({ ...s, name: e.target.value }))}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={newSession.startTime}
                                            onChange={(e) => setNewSession((s) => ({ ...s, startTime: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={newSession.endTime}
                                            onChange={(e) => setNewSession((s) => ({ ...s, endTime: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                        Session Price (₹) — leave blank to use base price
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="e.g. 18000"
                                        value={newSession.price}
                                        onChange={(e) => setNewSession((s) => ({ ...s, price: e.target.value }))}
                                    />
                                </div>
                                {sessionError && <p className="text-red-500 text-xs">{sessionError}</p>}
                                <button
                                    type="button"
                                    onClick={addCustomSession}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Session
                                </button>
                            </div>

                            {/* Added sessions list */}
                            {form.sessions.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-foreground mb-2">
                                        Sessions ({form.sessions.length})
                                    </p>
                                    <div className="space-y-2">
                                        {form.sessions.map((s) => (
                                            <div
                                                key={s.id}
                                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-input-background"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-4 h-4 text-primary shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">{s.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {fmt12h(s.startTime)} – {fmt12h(s.endTime)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {s.price ? (
                                                        <span className="text-sm font-medium text-foreground">
                                                            ₹{Number(s.price).toLocaleString("en-IN")}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">Base price</span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSession(s.id)}
                                                        className="text-muted-foreground hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Summary preview */}
                            <div className="bg-secondary/60 rounded-xl p-4 border border-border">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                    Summary Preview
                                </p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Name</span>
                                        <span className="font-medium text-foreground">{form.name || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Location</span>
                                        <span className="font-medium text-foreground">{form.location || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="font-medium text-foreground">{form.category || "—"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Capacity</span>
                                        <span className="font-medium text-foreground">
                                            {form.capacity ? `${form.capacity} guests` : "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base Price</span>
                                        <span className="font-medium text-foreground">
                                            {form.price
                                                ? `₹${Number(form.price).toLocaleString("en-IN")}/session`
                                                : "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amenities</span>
                                        <span className="font-medium text-foreground text-right max-w-[60%] truncate">
                                            {form.amenities.length ? form.amenities.join(", ") : "None selected"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sessions</span>
                                        <span className="font-medium text-foreground">
                                            {form.sessions.length
                                                ? form.sessions.map((s) => s.name).join(", ")
                                                : "None added"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer buttons */}
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between shrink-0">
                    {step === 1 ? (
                        <button
                            onClick={onClose}
                            className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors px-4 py-2"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors px-4 py-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="bg-accent text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Publish Venue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddVenueModal;
