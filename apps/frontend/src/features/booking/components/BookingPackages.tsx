/* eslint-disable */

import { AppText, getText } from "@/lib/language/LanguageHelper";

import PackageCard from "./PackageCard";
import { Venue } from "@/types/Venue";
import { bookingPackagesStyle } from "@/features/booking/styles/BookingPackagesStyle";
import { format } from "date-fns";

type BookingPackagesProps = {
    venue: Venue | null;
    selectedDates?: Date[];
    selectedSlots: { [dateStr: string]: string[] };
    onSelectSlot: (dateStr: string, slotId: string) => void;
};

const parseTimeToMinutes = (timeStr: string, dayOffset: number = 0): number => {
    if (!timeStr) return 0;
    const clean = timeStr.trim().toUpperCase();
    
    let hours = 0;
    let minutes = 0;
    
    const ampmMatch = clean.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (ampmMatch) {
        hours = parseInt(ampmMatch[1], 10);
        minutes = parseInt(ampmMatch[2], 10);
        const ampm = ampmMatch[3];
        if (ampm === "PM" && hours !== 12) {
            hours += 12;
        } else if (ampm === "AM" && hours === 12) {
            hours = 0;
        }
    } else {
        const parts = clean.split(":");
        if (parts.length >= 2) {
            hours = parseInt(parts[0], 10) || 0;
            minutes = parseInt(parts[1], 10) || 0;
        }
    }
    
    return dayOffset * 24 * 60 + hours * 60 + minutes;
};

const slotsOverlap = (slotA: any, slotB: any): boolean => {
    const isFullA = slotA.label?.toLowerCase().includes("full") || slotA.label?.toLowerCase().includes("fullday");
    const isFullB = slotB.label?.toLowerCase().includes("full") || slotB.label?.toLowerCase().includes("fullday");
    if (isFullA || isFullB) {
        return true;
    }
    
    const startA = parseTimeToMinutes(slotA.startTime, slotA.startDayOffset || 0);
    const endA = parseTimeToMinutes(slotA.endTime, slotA.endDayOffset || 0);
    
    const startB = parseTimeToMinutes(slotB.startTime, slotB.startDayOffset || 0);
    const endB = parseTimeToMinutes(slotB.endTime, slotB.endDayOffset || 0);
    
    return startA < endB && startB < endA;
};

const sortSlots = (slots: any[]) => {
    return [...slots].sort((a, b) => {
        const isFullA = a.label?.toLowerCase().includes("full") || a.label?.toLowerCase().includes("fullday");
        const isFullB = b.label?.toLowerCase().includes("full") || b.label?.toLowerCase().includes("fullday");
        if (isFullA && !isFullB) return -1;
        if (!isFullA && isFullB) return 1;
        return 0;
    });
};

export default function BookingPackages({
    venue,
    selectedDates,
    selectedSlots,
    onSelectSlot,
}: BookingPackagesProps) {
    const defaultDates: Date[] = [];
    const dates = selectedDates || defaultDates;

    if (dates.length === 0) {
        return (
            <section className={bookingPackagesStyle.card}>
                <div className={bookingPackagesStyle.header}>
                    <div>
                        <h2 className={bookingPackagesStyle.title}>
                            <AppText textName="CHOOSE_BOOKING_PACKAGE" textModule="LABEL" />
                        </h2>
                        <p className={bookingPackagesStyle.subtitle}>
                            <AppText textName="SELECT_PACKAGE_FOR_EACH_DATE" textModule="LABEL" />
                        </p>
                    </div>
                </div>
                <div className={bookingPackagesStyle.emptyText}>
                    <AppText textName="SELECT_DATE_TO_CHOOSE_PACKAGES" textModule="LABEL" />
                </div>
            </section>
        );
    }

    const slotTemplates = venue?.slotTemplates ? sortSlots(venue.slotTemplates) : [];

    const isSlotDisabled = (dateStr: string, slot: any, allSlots: any[]) => {
        const selectedIds = selectedSlots[dateStr] || [];
        if (selectedIds.length === 0) return false;
        if (selectedIds.includes(slot.id)) return false;
        
        return allSlots.some(otherSlot => {
            if (!selectedIds.includes(otherSlot.id)) return false;
            return slotsOverlap(slot, otherSlot);
        });
    };

    return (
        <section className={bookingPackagesStyle.card}>

            <div className={bookingPackagesStyle.header}>

                <div>

                    <h2 className={bookingPackagesStyle.title}>
                        <AppText textName="CHOOSE_BOOKING_PACKAGE" textModule="LABEL" />
                    </h2>

                    <p className={bookingPackagesStyle.subtitle}>
                        <AppText textName="SELECT_PACKAGE_FOR_EACH_DATE" textModule="LABEL" />
                    </p>

                </div>

                <button className={bookingPackagesStyle.howBtn}>
                    <AppText textName="HOW_PACKAGES_WORK" textModule="LABEL" />
                </button>

            </div>

            <div className={bookingPackagesStyle.packagesList}>

                {dates.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const formattedDate = format(date, "dd MMM yyyy");
                    const selectedIds = selectedSlots[dateStr] || [];

                    return slotTemplates.map((slot) => {
                        const isSelected = selectedIds.includes(slot.id);
                        const disabled = isSlotDisabled(dateStr, slot, slotTemplates);

                        const isEvening = slot.label?.toLowerCase().includes("evening") || 
                                          slot.label?.toLowerCase().includes("night") ||
                                          (slot.startTime && (parseInt(slot.startTime) >= 12 || slot.startTime.toUpperCase().includes("PM")));

                        const price = slot.pricingTiers?.[0]?.price 
                            ? `₹${Number(slot.pricingTiers[0].price).toLocaleString("en-IN")}`
                            : "₹0";

                        return (
                            <PackageCard
                                key={`${dateStr}-${slot.id}`}
                                date={formattedDate}
                                title={slot.label}
                                time={`${slot.startTime} - ${slot.endTime}`}
                                guests={getText("GUESTS_RANGE", "LABEL", { min: slot.pricingTiers?.[0]?.minGuests || 50, max: slot.pricingTiers?.[0]?.maxGuests || 150 })}
                                price={price}
                                available={getText("AVAILABLE", "LABEL")}
                                selected={isSelected}
                                evening={isEvening}
                                disabled={disabled}
                                onClick={() => onSelectSlot(dateStr, slot.id)}
                            />
                        );
                    });
                })}

            </div>

        </section>
    );
}