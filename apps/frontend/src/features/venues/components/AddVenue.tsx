"use client";

import ActionButtons from "@/components/global/ActionButtons";
import Ammenities from "@/components/global/Ammenities";
import BasicInfo from "./BasicInfo";
import CapacityAndPricing from "./CapacityAndPricing";
import LocationForm from "@/components/global/LocationForm";
import PhotoUpload from "@/components/global/PhotoUpload";
import VenueHeader from "@/components/global/venueheader";
import VerifyBooking from "@/components/global/booking/VerifyBooking";
import { useState } from "react";
import { venueStyle } from "../styles/VenueStyle";

const AddVenue = () => {
    const [
        isOpen, setIsOpen
    ] = useState(true);

    return (
        <div className={venueStyle.pageWrapper}>
            <VerifyBooking
                isOpen={isOpen}
                onClose={() => {
                    return setIsOpen(false);
                }}
            />
            <VenueHeader />
            <form>
                <div className={venueStyle.formBox}>
                    {/* Left */}
                    <div>
                        <BasicInfo />
                        <CapacityAndPricing />
                        <Ammenities />
                        <PhotoUpload />
                    </div>
                    {/* Right */}
                    <LocationForm />
                </div>
                <ActionButtons />
            </form>
        </div>
    );
};

export default AddVenue;
