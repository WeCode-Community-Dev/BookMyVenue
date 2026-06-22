import { AlertCircle, Plus, Users } from "lucide-react";
import Image from "next/image";
import { BOOKINGS,fmt, STATUS_STYLE, type Venue } from "@/app/owner/types";

type Tab = "overview" | "bookings" | "venues";

interface OverviewTabProps {
    venues: Venue[];
    pending: number;
    onSetActiveTab: (tab: Tab) => void;
    onShowModal: () => void;
}

export default function OverviewTab({ venues, pending, onSetActiveTab, onShowModal }: OverviewTabProps) {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent bookings */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2
                        className="font-bold text-foreground"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Recent Bookings
                    </h2>
                    <button
                        onClick={() => onSetActiveTab("bookings")}
                        className="text-xs text-primary font-semibold hover:underline"
                    >
                        View all
                    </button>
                </div>
                <div className="divide-y divide-border">
                    {BOOKINGS.slice(0, 5).map((b) => (
                        <div
                            key={b.id}
                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{b.client}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {b.venue} · {b.date}
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-foreground">{fmt(b.amount)}</p>
                                <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[b.status]}`}
                                >
                                    {b.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
                {/* Venue quick view */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <h2
                            className="font-bold text-foreground"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            My Venues
                        </h2>
                        <button
                            onClick={() => onSetActiveTab("venues")}
                            className="text-xs text-primary font-semibold hover:underline"
                        >
                            Manage
                        </button>
                    </div>
                    <div className="divide-y divide-border">
                        {venues.slice(0, 3).map((v) => (
                            <div
                                key={v.id}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                            >
                                <Image
                                    src={v.image}
                                    alt={v.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">{v.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {v.location} · {v.bookings} bookings
                                    </p>
                                </div>
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${v.status === "Active" ? "bg-emerald-500" : "bg-gray-300"}`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="px-5 py-3 border-t border-border">
                        <button
                            onClick={onShowModal}
                            className="w-full flex items-center justify-center gap-1.5 text-sm text-primary font-semibold hover:text-accent transition-colors py-1"
                        >
                            <Plus className="w-4 h-4" /> Add New Venue
                        </button>
                    </div>
                </div>

                {/* Pending alert */}
                {pending > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">
                                {pending} pending {pending === 1 ? "request" : "requests"}
                            </p>
                            <p className="text-xs text-amber-700 mt-0.5 mb-3">
                                Respond within 24 hours to keep your response rate high.
                            </p>
                            <button
                                onClick={() => onSetActiveTab("bookings")}
                                className="text-xs font-bold text-amber-800 underline"
                            >
                                Review now →
                            </button>
                        </div>
                    </div>
                )}

                {/* Revenue breakdown */}
                <div className="bg-card border border-border rounded-2xl p-5">
                    <h3
                        className="font-bold text-foreground mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Revenue Breakdown
                    </h3>
                    {[
                        { label: "The Grand Pavilion", amount: 75000, pct: 52 },
                        { label: "Emerald Garden", amount: 65000, pct: 38 },
                        { label: "Lakeview Conference", amount: 27000, pct: 18 },
                    ].map(({ label, amount, pct }) => (
                        <div key={label} className="mb-3 last:mb-0">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-foreground font-medium truncate max-w-[60%]">{label}</span>
                                <span className="text-muted-foreground">{fmt(amount)}</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
