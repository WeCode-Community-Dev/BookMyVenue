"use client";

import { Users } from "lucide-react";
import { addVenueStyle } from "@/features/add-venue/styles/AddVenueStyle";

export default function CapacityAndPricing() {
    return (
        <div className={addVenueStyle.card}>
            {/* Header */}
            <div className={addVenueStyle.headerWrapper}>
                <Users className={addVenueStyle.headerIcon} />
                <h2 className={addVenueStyle.headerTitle}>
                    2. Capacity & Pricing
                </h2>
            </div>

            {/* First Row */}
            <div className={addVenueStyle.rowGrid3}>
                <div>
                    <label className={addVenueStyle.label}>
                        Min Guests *
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 50"
                        className={addVenueStyle.input}
                    />
                </div>

                <div>
                    <label className={addVenueStyle.label}>
                        Max Guests *
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 500"
                        className={addVenueStyle.input}
                    />
                </div>

                <div>
                    <label className={addVenueStyle.label}>
                        Price Per Day (₹) *
                    </label>

                    <input
                        type="number"
                        placeholder="e.g. 25000"
                        className={addVenueStyle.input}
                    />
                </div>
            </div>

            {/* Second Row */}
            <div className={addVenueStyle.rowWrapper}>
                <div className={addVenueStyle.rowGrid2}>
                    <div>
                        <label className={addVenueStyle.label}>
                            Security Deposit (₹)
                        </label>

                        <input
                            type="number"
                            placeholder="e.g. 5000"
                            className={addVenueStyle.input}
                        />
                    </div>

                    <div>
                        <label className={addVenueStyle.label}>
                            Extra Guest Price (₹)
                        </label>

                        <input
                            type="number"
                            placeholder="e.g. 500"
                            className={addVenueStyle.input}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
