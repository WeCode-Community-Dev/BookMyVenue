import BookingStepper from "./BookingStepper";
import BookingVenueCard from "./BookingVenueCard";

export default function Booking() {
    return (
        <div className="max-w-full px-6 py-2">
            <BookingStepper currentStep={1} />

            <div className="mt-6 grid grid-cols-12 gap-6">

                {/* Left */}
                <div className="col-span-8 space-y-6">
                    <BookingVenueCard />


                    {/* <EventDateSection /> */}
                    {/* 
                    <BookingPackageSection /> */}

                </div>

                {/* Right */}
                <div className="col-span-4 space-y-5">

                    {/* <BookingSummary />

                    <ReservationStatus /> */}

                </div>

            </div>
        </div>
    );
}
