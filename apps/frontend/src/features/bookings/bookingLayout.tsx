/* eslint-disable */

import BookingCalendar from "./BookingCalender";
import BookingHeader from "./BookingHeader";
import BookingPackages from "./BookingPackages";
import BookingSummary from "./BookingSummary";
import BookingVenueCard from "./BookingVenueCard";

export default function BookingLayout() {
    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <div className="mx-auto max-w-[1480px] px-6 pb-10">

                <BookingHeader currentStep={1} />

                <div className="mt-6 flex items-start gap-6">

                    {/* LEFT */}

                    <div className="flex-1 space-y-6">

                        <BookingVenueCard />

                        <BookingCalendar/>
                        

                        <BookingPackages/>

                    </div>

                    {/* RIGHT */}

                    <div className="w-[360px] shrink-0 space-y-6">

                        <BookingSummary />

                        {/* ReservationStatus */}

                    </div>

                </div>

            </div>
        </main>
    );
}