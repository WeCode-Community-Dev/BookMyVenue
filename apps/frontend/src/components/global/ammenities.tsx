"use client";

import { CheckSquare, Plus } from "lucide-react";

import { AmmenitiesProps } from "@/types/AddVenue";
import { AppText } from "@/lib/language/LanguageHelper";
import { useLanguage } from "@/store/AppConfigReducer";
import { useSelector } from "react-redux";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

const amenityKeys = [
    "PARKING",
    "AC",
    "WIFI",
    "CATERING",
    "POWER_BACKUP",
    "GENERATOR",
    "MUSIC",
    "ALCOHOL",
    "DECORATION",
] as const;

export default function Ammenities({
    selectedAmenities,
    setSelectedAmenities,
}: AmmenitiesProps) {
    // Consume language so the component re-renders on language change
    useSelector(useLanguage);

    const handleToggle = (key: string, checked: boolean) => {
        if (checked) {
            setSelectedAmenities([
                ...selectedAmenities, key
            ]);
        } else {
            setSelectedAmenities(
                selectedAmenities.filter((item) => {
                    return item !== key; 
                })
            );
        }
    };

    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <CheckSquare className={venueStyle.headerIcon} />

                <h2 className={venueStyle.headerTitle}>
                    {AppText({ textName: "HEADING", textModule: "AMENITIES" })}
                </h2>
            </div>

            {/* Amenities Grid */}
            <div className={venueStyle.amenitiesGrid}>
                {amenityKeys.map((key) => {
                    return (
                        <label
                            key={key}
                            className={venueStyle.checkboxLabel}
                        >
                            <input
                                type="checkbox"
                                checked={selectedAmenities.includes(key)}
                                onChange={(evt) => {
                                    return handleToggle(key, evt.target.checked);
                                }}
                                className={venueStyle.checkbox}
                            />

                            <span>
                                {AppText({ textName: key, textModule: "AMENITIES" })}
                            </span>
                        </label>
                    );
                })}
            </div>

            {/* Add More */}
            <button
                type="button"
                className={venueStyle.buttonSecondary}
            >
                <Plus className="h-4 w-4" />
                {AppText({ textName: "ADD_MORE_AMENITIES", textModule: "BUTTON" })}
            </button>
        </div>
    );
}
