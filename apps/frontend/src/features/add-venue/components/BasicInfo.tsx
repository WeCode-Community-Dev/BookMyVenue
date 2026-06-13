"use client";

import { Info } from "lucide-react";
import { addVenueStyle } from "../styles/AddVenueStyle";

export default function BasicInfo() {
    return (
        <div className={addVenueStyle.basicInfoCard}>
            {/* Header */}
            <div className={addVenueStyle.headerWrapper}>
                <Info className={addVenueStyle.headerIcon} />
                <h2 className={addVenueStyle.headerTitle}>
                    1. Basic Information
                </h2>
            </div>

            {/* Fields */}
            <div className={addVenueStyle.fieldGrid}>
                <div>
                    <label className={addVenueStyle.label}>
                        Venue Name *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter venue name"
                        className={addVenueStyle.input}
                    />
                </div>
                <div>
                    <label className={addVenueStyle.label}>
                        Venue Type *
                    </label>
                    <select className={addVenueStyle.select}>
                        <option>Select venue type</option>
                        <option>Banquet Hall</option>
                        <option>Resort</option>
                        <option>Auditorium</option>
                        <option>Convention Center</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div className={addVenueStyle.descriptionWrapper}>
                <label className={addVenueStyle.label}>
                    Short Description *
                </label>

                <textarea
                    rows={3}
                    maxLength={200}
                    placeholder="Describe your venue in a few words..."
                    className={addVenueStyle.textarea}
                />
                <div className={addVenueStyle.charCounter}>
                    0 / 200
                </div>
            </div>
        </div>
    );
}
