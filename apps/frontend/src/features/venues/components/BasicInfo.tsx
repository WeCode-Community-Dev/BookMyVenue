"use client";

import { Info } from "lucide-react";
import { venueStyle } from "../styles/VenueStyle";

export default function BasicInfo() {
    return (
        <div className={venueStyle.basicInfoCard}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <Info className={venueStyle.headerIcon} />
                <h2 className={venueStyle.headerTitle}>
                    1. Basic Information
                </h2>
            </div>

            {/* Fields */}
            <div className={venueStyle.fieldGrid}>
                <div>
                    <label className={venueStyle.label}>
                        Venue Name *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter venue name"
                        className={venueStyle.input}
                    />
                </div>
                <div>
                    <label className={venueStyle.label}>
                        Venue Type *
                    </label>
                    <select className={venueStyle.select}>
                        <option>Select venue type</option>
                        <option>Banquet Hall</option>
                        <option>Resort</option>
                        <option>Auditorium</option>
                        <option>Convention Center</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div className={venueStyle.descriptionWrapper}>
                <label className={venueStyle.label}>
                    Short Description *
                </label>

                <textarea
                    rows={3}
                    maxLength={200}
                    placeholder="Describe your venue in a few words..."
                    className={venueStyle.textarea}
                />
                <div className={venueStyle.charCounter}>
                    0 / 200
                </div>
            </div>
        </div>
    );
}
