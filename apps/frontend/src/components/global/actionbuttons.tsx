"use client";

import { AppText } from "@/lib/language/LanguageHelper";
import { useRouter } from "next/navigation";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

interface ActionButtonsProps {
    onCancel?: () => void;
}

export default function ActionButtons({ onCancel }: ActionButtonsProps) {
    const router = useRouter();

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.push("/venues");
        }
    };

    return (
        <div className={venueStyle.actionsContainer}>
            <div className={venueStyle.actionsWrapper}>
                <button
                    type="button"
                    onClick={handleCancel}
                    className={venueStyle.buttonSaveDraft}
                >
                    {AppText({ textName: "CANCEL", textModule: "BUTTON" })}
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
