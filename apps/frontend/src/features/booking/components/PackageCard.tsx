/* eslint-disable */

import {
    Check,
    Moon,
    Sun,
    Users,
} from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";
import { PackageCardProps } from "@/types/Booking";
import { packageCardStyle } from "../styles/PackageCardStyle";

export default function PackageCard({
    date,
    title,
    time,
    guests,
    price,
    available,
    selected = false,
    evening = false,
    onClick,
    disabled = false,
}: PackageCardProps) {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`${packageCardStyle.cardBase} ${
                selected ? packageCardStyle.cardSelected : packageCardStyle.cardUnselected
            } ${disabled ? packageCardStyle.cardDisabled : packageCardStyle.cardEnabled}`}
        >
            {/* Top */}
            <div className={packageCardStyle.contentWrapper}>
                <div className={packageCardStyle.headerRow}>
                    <span className={packageCardStyle.dateBadge}>
                        {date}
                    </span>

                    <div className={packageCardStyle.iconContainer}>
                        {evening ? (
                            <Moon className="h-6 w-6 text-purple-500" />
                        ) : (
                            <Sun className="h-6 w-6 text-orange-400" />
                        )}
                    </div>
                </div>

                <h3 className={packageCardStyle.titleText}>
                    {title}
                </h3>

                <p className={packageCardStyle.timeText}>
                    {time}
                </p>

                <div className={packageCardStyle.guestsRow}>
                    <Users className={packageCardStyle.guestsIcon} />
                    {guests}
                </div>

                <div className={packageCardStyle.footerRow}>
                    <span className={packageCardStyle.priceText}>
                        {price}
                    </span>

                    {available && (
                        <span className={packageCardStyle.availableBadge}>
                            {available}
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom Button */}
            {selected ? (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); if (!disabled && onClick) onClick(); }}
                    className={packageCardStyle.btnSelected}
                >
                    <Check className="mr-2 h-4 w-4" />
                    <AppText textName="SELECTED" textModule="BUTTON" />
                </button>
            ) : (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={(e) => { e.stopPropagation(); if (!disabled && onClick) onClick(); }}
                    className={`${packageCardStyle.btnUnselected} ${disabled ? packageCardStyle.btnDisabled : ""}`}
                >
                    {disabled ? (
                        <AppText textName="UNAVAILABLE" textModule="BUTTON" />
                    ) : (
                        <AppText textName="SELECT_PACKAGE" textModule="BUTTON" />
                    )}
                </button>
            )}
        </div>
    );
}