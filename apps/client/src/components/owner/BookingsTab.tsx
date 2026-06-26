import { CalendarCheck, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { BOOKINGS, fmt, STATUS_DOT, STATUS_STYLE, type Booking, type BookingStatus } from "@/app/owner/types";
import { useOwnerBookings } from "@/hooks/useBooking";

interface BookingsTabProps {
    bookingFilter: BookingStatus | "All";
    searchQ: string;
    filteredBookings: Booking[];
    onFilterChange: (filter: BookingStatus | "All") => void;
    onSearchChange: (q: string) => void;
}

export default function BookingsTab({
    bookingFilter,
    searchQ,
    filteredBookings,
    onFilterChange,
    onSearchChange,
}: BookingsTabProps) {
    const { data: bookings = [], isLoading, isError, error } = useOwnerBookings({});
    console.log({ bookings });

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Filters */}
            <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                        className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Search by client, venue, or booking ID..."
                        value={searchQ}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 shrink-0">
                    {(["All", "Confirmed", "Cancelled"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => onFilterChange(s)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                bookingFilter === s
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-secondary"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            {["Booking ID", "Client", "Venue", "Date", "Guests", "Amount", "Status"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                                    {b.id}
                                </td>
                                <td className="px-5 py-3.5">
                                    <div>
                                        <p className="font-semibold text-foreground">{b.client}</p>
                                        <p className="text-xs text-muted-foreground">{b.category}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-foreground/80 whitespace-nowrap">
                                    {b.venue}
                                </td>
                                <td className="px-5 py-3.5 text-foreground/70 whitespace-nowrap">{b.date}</td>
                                <td className="px-5 py-3.5 text-foreground/70">{b.guests}</td>
                                <td className="px-5 py-3.5 font-bold text-foreground whitespace-nowrap">
                                    {fmt(b.amount)}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[b.status]}`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status]}`}
                                        />
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredBookings.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-25" />
                        <p className="font-medium">No bookings match your filter.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    Showing {filteredBookings.length} of {BOOKINGS.length} bookings
                </span>
                <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
