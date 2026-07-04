import { Plus, Users } from "lucide-react";
import Image from "next/image";
import type { OwnerDashboardBooking, OwnerDashboardVenue } from "@bookmyvenue/types";
import { fmtDate } from "@/lib/utils";
import { STATUS_STYLE } from "@/app/owner/types";

type Tab = "overview" | "bookings" | "venues";

interface OverviewTabProps {
    venues: OwnerDashboardVenue[];
    recentBookings: OwnerDashboardBooking[];
    onSetActiveTab: (tab: Tab) => void;
    onShowModal: () => void;
    isLoading: boolean;
}

export default function OverviewTab({
    venues,
    recentBookings,
    onSetActiveTab,
    onShowModal,
    isLoading,
}: OverviewTabProps) {
    
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent bookings */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-foreground">Recent Bookings</h2>
                    <button
                        onClick={() => onSetActiveTab("bookings")}
                        className="text-xs text-primary font-semibold hover:underline"
                    >
                        View all
                    </button>
                </div>
                <div className="divide-y divide-border">
                    {isLoading ? (
                        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                            Loading bookings…
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                            No bookings yet.
                        </div>
                    ) : (
                        recentBookings.slice(0, 6).map((b) => {
                            const status = b.status;
                            return (
                                <div
                                    key={b.id}
                                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {b.user.name ?? "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {b.venue.name} ·{" "}
                                            {b.eventDate ? fmtDate(b.eventDate) : "—"}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-foreground">
                                            {"₹" + b.totalAmount.toLocaleString()}
                                        </p>
                                        <span
                                            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[status]}`}
                                        >
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
                {/* Venue quick view */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <h2 className="font-bold text-foreground">My Venues</h2>
                        <button
                            onClick={() => onSetActiveTab("venues")}
                            className="text-xs text-primary font-semibold hover:underline"
                        >
                            Manage
                        </button>
                    </div>
                    <div className="divide-y divide-border">
                        {venues.slice(0, 5).map((v) => (
                            <div
                                key={v.id}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                            >
                                <Image
                                    src={v.images[0]!}
                                    alt={v.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">{v.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {v.location}, {v.bookingCount} bookings
                                    </p>
                                </div>
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${v.isActive ? "bg-emerald-500" : "bg-gray-300"}`}
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
            </div>
        </div>
    );
}
