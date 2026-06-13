"use client";

import { addVenueStyle } from "@/features/add-venue/styles/AddVenueStyle";

export default function ActionButtons() {
    return (
        <div className={addVenueStyle.actionsContainer}>
            <div className={addVenueStyle.actionsWrapper}>
                <button
                    type="button"
                    className={addVenueStyle.buttonSaveDraft}
                >
                    Save Draft
                </button>

                <button
                    type="submit"
                    className={addVenueStyle.buttonSaveContinue}
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
