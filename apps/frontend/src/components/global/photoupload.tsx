"use client";

import { Plus, Upload } from "lucide-react";
import { addVenueStyle } from "@/features/add-venue/styles/AddVenueStyle";

export default function PhotoUpload() {
    return (
        <div className={addVenueStyle.card}>
            {/* Header */}
            <div className={addVenueStyle.headerWrapper}>
                <Upload className={addVenueStyle.headerIcon} />

                <h2 className={addVenueStyle.headerTitle}>
                    4. Photos
                </h2>
            </div>

            <div className="grid gap-4">
                {/* Cover Image */}
                <div className={addVenueStyle.uploadZone}>
                    <Upload className={addVenueStyle.uploadIcon} />

                    <p className={addVenueStyle.uploadText}>
                        Upload Cover Image
                    </p>

                    <p className={addVenueStyle.uploadSubtext}>
                        Recommended: 1280 × 720 px
                    </p>
                </div>

                {/* Gallery Images */}
                <div>
                    <p className={addVenueStyle.galleryLabel}>
                        Additional Photos
                    </p>

                    <div className={addVenueStyle.galleryGrid}>
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
                                    className={addVenueStyle.galleryAddButton}
                                >
                                    <Plus className={addVenueStyle.galleryAddIcon} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Upload Hint */}
                <p className={addVenueStyle.uploadSubtext}>
                    Upload up to 10 high-quality venue photos.
                </p>
            </div>
        </div>
    );
}
