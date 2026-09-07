import { AppText } from "@/lib/language/LanguageHelper";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SCREENS } from "@/lib/Constants";
import { addVenueCardStyle } from "./AddVenueCardStyle";

export default function AddVenueCard() {
    return (
        <Link href={SCREENS.ADD_VENUE} className={addVenueCardStyle.link}>
            <div className={addVenueCardStyle.card}>
                <div className={addVenueCardStyle.innerContainer}>
                    <div className={addVenueCardStyle.plusIconWrapper}>
                        <Plus className={addVenueCardStyle.plusIcon} />
                    </div>

                    <h3 className={addVenueCardStyle.title}>
                        <AppText textName="ADD_NEW_VENUE" textModule="LABEL" />
                    </h3>

                    <p className={addVenueCardStyle.description}>
                        <AppText textName="ADD_VENUE_DESC" textModule="LABEL" />
                    </p>
                </div>
            </div>
        </Link>
    );
}
