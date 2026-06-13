"use client";

import { Plus, Upload } from "lucide-react";

import { venueStyle } from "@/features/venues/styles/VenueStyle";

export default function PhotoUpload() {
    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <Upload className={venueStyle.headerIcon} />

                <h2 className={venueStyle.headerTitle}>
                    4. Photos
                </h2>
            </div>

            <div className="grid gap-4">
                {/* Cover Image */}
                <div className={venueStyle.uploadZone}>
                    <Upload className={venueStyle.uploadIcon} />

                    <p className={venueStyle.uploadText}>
                        Upload Cover Image
                    </p>

                    <p className={venueStyle.uploadSubtext}>
                        Recommended: 1280 × 720 px
                    </p>
                </div>

                {/* Gallery Images */}
                <div>
                    <p className={venueStyle.galleryLabel}>
                        Additional Photos
                    </p>

                    <div className={venueStyle.galleryGrid}>
                        {[
                            1,
                            2,
                            3,
                            4,
                            5,
                        ].map((item) => {
                            return (
                                <button
                                    key={item}
                                    type="button"
                                    className={venueStyle.galleryAddButton}
                                >
                                    <Plus className={venueStyle.galleryAddIcon} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Upload Hint */}
                <p className={venueStyle.uploadSubtext}>
                    Upload up to 10 high-quality venue photos.
                </p>
            </div>
        </div>
    );
}
