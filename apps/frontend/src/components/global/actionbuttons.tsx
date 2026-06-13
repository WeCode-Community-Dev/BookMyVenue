"use client";

import { venueStyle } from "@/features/venues/styles/VenueStyle";

export default function ActionButtons() {
    return (
        <div className={venueStyle.actionsContainer}>
            <div className={venueStyle.actionsWrapper}>
                <button
                    type="button"
                    className={venueStyle.buttonSaveDraft}
                >
                    Save Draft
                </button>

                <button
                    type="submit"
                    className={venueStyle.buttonSaveContinue}
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
