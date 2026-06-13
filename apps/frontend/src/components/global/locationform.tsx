"use client";

import { MapPin, Search } from "lucide-react";
import { addVenueStyle } from "@/features/add-venue/styles/AddVenueStyle";

export default function LocationForm() {
    return (
        <div className={addVenueStyle.card}>
            {/* Header */}
            <div className={addVenueStyle.headerWrapper}>
                <MapPin className={addVenueStyle.headerIcon} />

                <div>
                    <h2 className={addVenueStyle.headerTitle}>
                        5. Location
                    </h2>

                    <p className={addVenueStyle.headerSubtitle}>
                        Search or pin the exact location of your venue
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className={addVenueStyle.searchWrapper}>
                <Search className={addVenueStyle.searchIcon} />

                <input
                    placeholder="Search for an address or area"
                    className={addVenueStyle.searchInput}
                />
            </div>

            {/* Map */}
            <div className={addVenueStyle.mapBox}>
                <div className={addVenueStyle.mapTextWrapper}>
                    <p className={addVenueStyle.mapText}>
                        OpenLayers Map Here
                    </p>
                </div>
            </div>

            <p className={addVenueStyle.mapHint}>
                Drag the marker to adjust the exact location
            </p>

            {/* Coordinates */}
            <div className={addVenueStyle.coordinatesGrid}>
                <div>
                    <label className={addVenueStyle.label}>
                        Latitude
                    </label>

                    <input
                        value="10.0330"
                        readOnly
                        className={addVenueStyle.readOnlyInput}
                    />
                </div>

                <div>
                    <label className={addVenueStyle.label}>
                        Longitude
                    </label>

                    <input
                        value="76.3454"
                        readOnly
                        className={addVenueStyle.readOnlyInput}
                    />
                </div>
            </div>

            {/* Address */}
            <div className={addVenueStyle.fieldSpacing}>
                <label className={addVenueStyle.label}>
                    Address
                </label>

                <input
                    placeholder="Full address"
                    className={addVenueStyle.input}
                />
            </div>

            {/* Landmark */}
            <div className={addVenueStyle.fieldSpacing}>
                <label className={addVenueStyle.label}>
                    Landmark (Optional)
                </label>

                <input
                    placeholder="Near Metro Station"
                    className={addVenueStyle.input}
                />
            </div>
        </div>
    );
}
