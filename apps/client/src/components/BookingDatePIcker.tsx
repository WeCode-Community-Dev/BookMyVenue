import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";
import { useRouter } from "next/navigation";
import { formatEnum, toDateString } from "@/lib/utils";
import { VenueDetail } from "@bookmyvenue/types";
import { Calendar } from "./ui/calendar";

type BookingDatePickerProps = {
    venue: VenueDetail;
};

const BookingDatePIcker = ({ venue }: BookingDatePickerProps) => {
    const router = useRouter();

    const selectedSessions = useBookingStore((s) => s.selectedSessions);
    const toggleSession = useBookingStore((s) => s.toggleSession);
    const selectedDate = useBookingStore((s) => s.selectedDate);
    const setSelectedDate = useBookingStore((s) => s.setSelectedDate);

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookedDates = venue.disabledDates.map((date) => new Date(`${date}T00:00:00`));
    const booked = selectedDate ? (venue.bookedSessions[selectedDate] ?? []) : [];

    return (
        <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">{venue.name}</h1>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>
                            {venue.location}, {formatEnum(venue.district)}
                        </span>
                    </div>
                </div>

                <div className="border-t border-border pt-5">
                    <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-3">
                        <CalendarDays className="w-4 h-4" />
                        Select date
                    </h3>
                    <Calendar
                        mode="single"
                        selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
                        onSelect={(date) => setSelectedDate(date ? toDateString(date) : null)}
                        disabled={[{ before: tomorrow }, bookedDates]}
                        modifiers={{
                            booked: bookedDates,
                        }}
                        modifiersClassNames={{
                            booked: "bg-destructive/10 text-destructive line-through opacity-100 cursor-not-allowed rounded-md",
                        }}
                        className="w-full [--cell-size:--spacing(9)] rounded-md"
                    />
                </div>

                <div className="border-t border-border pt-5">
                    <h3 className="text-sm font-bold text-foreground mb-3">Sessions</h3>
                    {venue.sessions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No sessions available.</p>
                    ) : (
                        <div className="space-y-2">
                            {venue.sessions.map((s) => {
                                const isBooked = booked.includes(s.id!);
                                const isSelected = selectedSessions.includes(s.id!);

                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        disabled={isBooked}
                                        onClick={() => toggleSession(s.id!)}
                                        className={`
                w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all
                ${
                    isBooked
                        ? "border-destructive/30 bg-destructive/5 text-muted-foreground cursor-not-allowed opacity-70"
                        : isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary cursor-pointer"
                          : "border-border hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
                }`}
                                    >
                                        <div>
                                            <p
                                                className={`text-sm font-medium ${isBooked ? "line-through" : ""}`}
                                            >
                                                {s.label}
                                            </p>

                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {s.startTime} – {s.endTime}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-primary">
                                                ₹{s.price.toLocaleString("en-IN")}
                                            </span>

                                            {isBooked && (
                                                <span className="text-xs font-medium text-destructive">
                                                    Booked
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => router.push(`/venues/${venue.id}/book`)}
                    disabled={venue.sessions.length === 0 || !selectedDate || selectedSessions.length === 0}
                    className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Book Now
                </button>
            </div>
        </aside>
    );
};

export default BookingDatePIcker;
