"use client";

import { CheckSquare, Plus } from "lucide-react";

import { venueStyle } from "@/features/venues/styles/VenueStyle";

const amenities = [
    "Parking",
    "AC / Air Conditioned",
    "WiFi",
    "Catering Allowed",
    "Power Backup",
    "Generator",
    "Music Allowed",
    "Alcohol Allowed",
    "Decoration Allowed",
];

export default function Ammenities() {
    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <CheckSquare className={venueStyle.headerIcon} />

                <h2 className={venueStyle.headerTitle}>
                    3. Amenities
                </h2>
            </div>

            {/* Amenities Grid */}
            <div className={venueStyle.amenitiesGrid}>
                {amenities.map((item) => {
                    return (
                        <label
                            key={item}
                            className={venueStyle.checkboxLabel}
                        >
                            <input
                                type="checkbox"
                                className={venueStyle.checkbox}
                            />

                            <span>{item}</span>
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
                Add More Amenities
            </button>
        </div>
    );
}
