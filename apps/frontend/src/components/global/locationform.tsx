"use client";

import { MapPin, Search } from "lucide-react";

import { venueStyle } from "@/features/venues/styles/VenueStyle";

export default function LocationForm() {
    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <MapPin className={venueStyle.headerIcon} />

                <div>
                    <h2 className={venueStyle.headerTitle}>
                        5. Location
                    </h2>

                    <p className={venueStyle.headerSubtitle}>
                        Search or pin the exact location of your venue
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className={venueStyle.searchWrapper}>
                <Search className={venueStyle.searchIcon} />

                <input
                    placeholder="Search for an address or area"
                    className={venueStyle.searchInput}
                />
            </div>

            {/* Map */}
            <div className={venueStyle.mapBox}>
                <div className={venueStyle.mapTextWrapper}>
                    <p className={venueStyle.mapText}>
                        OpenLayers Map Here
                    </p>
                </div>
            </div>

            <p className={venueStyle.mapHint}>
                Drag the marker to adjust the exact location
            </p>

            {/* Coordinates */}
            <div className={venueStyle.coordinatesGrid}>
                <div>
                    <label className={venueStyle.label}>
                        Latitude
                    </label>

                    <input
                        value="10.0330"
                        readOnly
                        className={venueStyle.readOnlyInput}
                    />
                </div>

                <div>
                    <label className={venueStyle.label}>
                        Longitude
                    </label>

                    <input
                        value="76.3454"
                        readOnly
                        className={venueStyle.readOnlyInput}
                    />
                </div>
            </div>

            {/* Address */}
            <div className={venueStyle.fieldSpacing}>
                <label className={venueStyle.label}>
                    Address
                </label>

                <input
                    placeholder="Full address"
                    className={venueStyle.input}
                />
            </div>

            {/* Landmark */}
            <div className={venueStyle.fieldSpacing}>
                <label className={venueStyle.label}>
                    Landmark (Optional)
                </label>

                <input
                    placeholder="Near Metro Station"
                    className={venueStyle.input}
                />
            </div>
        </div>
    );
}
