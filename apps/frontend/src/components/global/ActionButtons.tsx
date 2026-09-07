"use client";

import { SCREENS } from "@/lib/Constants";
import { getText } from "@/lib/language/LanguageHelper";
import { useLanguage } from "@/store/AppConfigReducer";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

interface ActionButtonsProps {
    onCancel?: () => void;
}

export default function ActionButtons({ onCancel }: ActionButtonsProps) {
    const router = useRouter();
    useSelector(useLanguage);

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.push(SCREENS.VENUES);
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
                    {getText("CANCEL", "BUTTON")}
                </button>

                <button
                    type="submit"
                    className={venueStyle.buttonSaveContinue}
                >
                    {getText("SUBMIT", "BUTTON")}
                </button>
            </div>
        </div>
    );
}
