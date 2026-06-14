"use client";

import { Users } from "lucide-react";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

export default function CapacityAndPricing() {
    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <Users className={venueStyle.headerIcon} />
                <h2 className={venueStyle.headerTitle}>
                    2. Capacity & Pricing
                </h2>
            </div>

            {/* First Row */}
            <div className={venueStyle.rowGrid3}>
                <div>
                    <label className={venueStyle.label}>
                        Min Guests *
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 50"
                        className={venueStyle.input}
                    />
                </div>

                <div>
                    <label className={venueStyle.label}>
                        Max Guests *
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 500"
                        className={venueStyle.input}
                    />
                </div>

                <div>
                    <label className={venueStyle.label}>
                        Price Per Day (₹) *
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 25000"
                        className={venueStyle.input}
                    />
                </div>
            </div>

            {/* Second Row */}
            <div className={venueStyle.rowWrapper}>
                <div className={venueStyle.rowGrid2}>
                    <div>
                        <label className={venueStyle.label}>
                            Security Deposit (₹)
                        </label>

                        <input
                            type="number"
                            placeholder="e.g. 5000"
                            className={venueStyle.input}
                        />
                    </div>

                    <div>
                        <label className={venueStyle.label}>
                            Extra Guest Price (₹)
                        </label>

                        <input
                            type="number"
                            placeholder="e.g. 500"
                            className={venueStyle.input}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
