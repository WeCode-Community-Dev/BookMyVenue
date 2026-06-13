"use client";

import { CheckSquare, Plus } from "lucide-react";
import { addVenueStyle } from "@/features/add-venue/styles/AddVenueStyle";

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
        <div className={addVenueStyle.card}>
            {/* Header */}
            <div className={addVenueStyle.headerWrapper}>
                <CheckSquare className={addVenueStyle.headerIcon} />

                <h2 className={addVenueStyle.headerTitle}>
                    3. Amenities
                </h2>
            </div>

            {/* Amenities Grid */}
            <div className={addVenueStyle.amenitiesGrid}>
                {amenities.map((item) => {
                    return (
                        <label
                            key={item}
                            className={addVenueStyle.checkboxLabel}
                        >
                            <input
                                type="checkbox"
                                className={addVenueStyle.checkbox}
                            />

                            <span>{item}</span>
                        </label>
                    );
                })}
            </div>

            {/* Add More */}
            <button
                type="button"
                className={addVenueStyle.buttonSecondary}
            >
                <Plus className="h-4 w-4" />
                Add More Amenities
            </button>
        </div>
    );
}
