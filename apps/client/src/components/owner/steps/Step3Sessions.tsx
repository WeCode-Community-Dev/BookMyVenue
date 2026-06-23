import { useState } from "react";
import { z } from "zod";
import { fmt12h } from "@/lib/utils";
import { Clock, Plus, Trash2 } from "lucide-react";

export interface Session {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    price: string;
}

const newSessionSchema = z
    .object({
        label: z.string().min(1, "Session name is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        price: z
            .string()
            .refine((v) => v !== "" && !isNaN(Number(v)) && Number(v) > 0, "Valid price is required"),
    })
    .refine((d) => d.startTime < d.endTime, {
        message: "End time must be after start time",
        path: ["endTime"],
    });

interface Step3Props {
    form: {
        name: string;
        district: string;
        category: string;
        capacity: string;
        amenities: string[];
        sessions: Session[];
    };
    setSessions: (sessions: Session[]) => void;
    stepError?: string;
}

export function Step3Sessions({ form, setSessions, stepError }: Step3Props) {
    const [newSession, setNewSession] = useState({ label: "", startTime: "", endTime: "", price: "" });
    const [sessionError, setSessionError] = useState("");

    const addCustomSession = () => {
        const result = newSessionSchema.safeParse(newSession);
        if (!result.success) {
            setSessionError(result.error.issues[0]!.message);
            return;
        }
        setSessionError("");
        setSessions([...form.sessions, { id: Date.now().toString(), ...newSession }]);
        setNewSession({ label: "", startTime: "", endTime: "", price: "" });
    };

    const removeSession = (id: string) =>
        setSessions(form.sessions.filter((s) => s.id !== id));

    return (
        <div className="space-y-5">
            <div className="border border-border rounded-xl p-4 space-y-3 bg-secondary/30">
                <p className="text-sm font-semibold text-foreground">Add Custom Session</p>
                <input
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Session name (e.g. Night Gala)"
                    value={newSession.label}
                    onChange={(e) => setNewSession((s) => ({ ...s, label: e.target.value }))}
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

            {stepError && <p className="text-red-500 text-xs -mt-2">{stepError}</p>}

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
                                        <p className="text-sm font-semibold text-foreground">{s.label}</p>
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
                        <span className="text-muted-foreground">District</span>
                        <span className="font-medium text-foreground">{form.district || "—"}</span>
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
                        <span className="text-muted-foreground">Amenities</span>
                        <span className="font-medium text-foreground text-right max-w-[60%] truncate">
                            {form.amenities.length ? form.amenities.join(", ") : "None selected"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
