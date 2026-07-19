"use client";

import { MapPin, Search } from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";
import { LocationFormProps } from "@/types/AddVenue";
import { useLanguage } from "@/store/AppConfigReducer";
import { useSelector } from "react-redux";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

const txt = (textName: string) => {
    return AppText({ textName, textModule: "LOCATION" }); 
};

export default function LocationForm({
    addressLine,
    setAddressLine,
    city,
    setCity,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
}: LocationFormProps) {
    // Re-render on language change
    useSelector(useLanguage);

    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <MapPin className={venueStyle.headerIcon} />

                <div>
                    <h2 className={venueStyle.headerTitle}>
                        {txt("HEADING")}
                    </h2>

                    <p className={venueStyle.headerSubtitle}>
                        {txt("SUBTITLE")}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className={venueStyle.searchWrapper}>
                <Search className={venueStyle.searchIcon} />

                <input
                    placeholder={txt("SEARCH_PLACEHOLDER")}
                    className={venueStyle.searchInput}
                />
            </div>

            {/* Map */}
            <div className={venueStyle.mapBox}>
                <div className={venueStyle.mapTextWrapper}>
                    <p className={venueStyle.mapText}>
                        {txt("MAP_PLACEHOLDER")}
                    </p>
                </div>
            </div>

            <p className={venueStyle.mapHint}>
                {txt("MAP_HINT")}
            </p>

            {/* Coordinates */}
            <div className={venueStyle.coordinatesGrid}>
                <div>
                    <label className={venueStyle.label}>
                        {txt("LATITUDE")}
                    </label>

                    <input
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(evt) => {
                            return setLatitude(Number(evt.target.value));
                        }}
                        className={venueStyle.input}
                        required
                    />
                </div>

                <div>
                    <label className={venueStyle.label}>
                        {txt("LONGITUDE")}
                    </label>

                    <input
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(evt) => {
                            return setLongitude(Number(evt.target.value));
                        }}
                        className={venueStyle.input}
                        required
                    />
                </div>
            </div>

            {/* City */}
            <div className={venueStyle.fieldSpacing}>
                <label className={venueStyle.label}>
                    {txt("CITY")}
                </label>

                <input
                    placeholder={txt("CITY_PLACEHOLDER")}
                    value={city}
                    onChange={(evt) => {
                        return setCity(evt.target.value);
                    }}
                    className={venueStyle.input}
                    required
                />
            </div>

            {/* Address */}
            <div className={venueStyle.fieldSpacing}>
                <label className={venueStyle.label}>
                    {txt("ADDRESS")}
                </label>

                <input
                    placeholder={txt("ADDRESS_PLACEHOLDER")}
                    value={addressLine}
                    onChange={(evt) => {
                        return setAddressLine(evt.target.value);
                    }}
                    className={venueStyle.input}
                    required
                />
            </div>

            {/* Landmark */}
            <div className={venueStyle.fieldSpacing}>
                <label className={venueStyle.label}>
                    {txt("LANDMARK")}
                </label>

                <input
                    placeholder={txt("LANDMARK_PLACEHOLDER")}
                    className={venueStyle.input}
                />
            </div>
        </div>
    );
}
