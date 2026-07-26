/* eslint-disable */

import { AppText, getText } from "@/lib/language/LanguageHelper";

import PackageCard from "./PackageCard";
import { bookingPackagesStyle } from "@/features/booking/styles/BookingPackagesStyle";
import { format } from "date-fns";

export default function BookingPackages({ selectedDates }: { selectedDates?: Date[] }) {
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

                {dates.map((date, idx) => {
                    const isEvening = idx % 2 !== 0;
                    const formattedDate = format(date, "dd MMM yyyy");
                    const title = isEvening 
                        ? getText("EVENING_RECEPTION_PACKAGE", "LABEL") 
                        : getText("MORNING_WEDDING_PACKAGE", "LABEL");
                    const time = isEvening ? "04:00 PM - 10:00 PM" : "09:00 AM - 01:00 PM";
                    const price = isEvening ? "₹30,000" : "₹18,000";

                    return (
                        <PackageCard
                            key={date.toISOString() + idx}
                            date={formattedDate}
                            title={title}
                            time={time}
                            guests={getText("GUESTS_RANGE", "LABEL", { min: 50, max: 150 })}
                            price={price}
                            available={getText("AVAILABLE", "LABEL")}
                            selected={true}
                            evening={isEvening}
                        />
                    );
                })}

            </div>

        </section>
    );
}