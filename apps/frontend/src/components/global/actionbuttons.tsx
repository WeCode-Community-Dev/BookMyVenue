"use client";

import { AppText } from "@/lib/language/LanguageHelper";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

export default function ActionButtons() {
    return (
        <div className={venueStyle.actionsContainer}>
            <div className={venueStyle.actionsWrapper}>
                <button
                    type="button"
                    className={venueStyle.buttonSaveDraft}
                >
                    {AppText({ textName: "SAVE_DRAFT", textModule: "BUTTON" })}
                </button>

                <button
                    type="submit"
                    className={venueStyle.buttonSaveContinue}
                >
                    {AppText({ textName: "SUBMIT_CONTINUE", textModule: "BUTTON" })}
                </button>
            </div>
        </div>
    );
}
