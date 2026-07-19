"use client";

import { AppText } from "@/lib/language/LanguageHelper";
import { BasicInfoProps } from "@/types/AddVenue";
import { Info } from "lucide-react";
import { useLanguage } from "@/store/AppConfigReducer";
import { useSelector } from "react-redux";
import { venueStyle } from "../styles/VenueStyle";

const txt = (textName: string) => {
    return AppText({ textName, textModule: "BASIC_INFO" }); 
};

const MAX_DESC_LENGTH = 2000;

const availableCategories = [
    { labelKey: "CAT_BIRTHDAY", value: "BIRTHDAY" },
    { labelKey: "CAT_WEDDING", value: "WEDDING" },
    { labelKey: "CAT_CORPORATE", value: "CORPORATE" },
    { labelKey: "CAT_MEETUP", value: "MEETUP" },
    { labelKey: "CAT_CELEBRATION", value: "CELEBRATION" },
    { labelKey: "CAT_OTHER", value: "OTHER" },
];

const venueTypes = [
    { labelKey: "TYPE_BANQUET", value: "BANQUET_HALL" },
    { labelKey: "TYPE_RESORT", value: "RESORT" },
    { labelKey: "TYPE_AUDITORIUM", value: "AUDITORIUM" },
    { labelKey: "TYPE_CAFE", value: "CAFE_RESTAURANT" },
    { labelKey: "TYPE_LAWN", value: "OPEN_LAWN" },
    { labelKey: "TYPE_OTHER", value: "OTHER" },
];

export default function BasicInfo({
    venueName,
    setVenueName,
    venueType,
    setVenueType,
    description,
    setDescription,
    categories,
    setCategories,
}: BasicInfoProps) {
    useSelector(useLanguage);

    const handleCategoryChange = (val: string, checked: boolean) => {
        if (checked) {
            setCategories([
                ...categories, val
            ]);
        } else {
            setCategories(categories.filter((cat) => {
                return cat !== val; 
            }));
        }
    };

    return (
        <div className={venueStyle.basicInfoCard}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <Info className={venueStyle.headerIcon} />
                <h2 className={venueStyle.headerTitle}>
                    {txt("HEADING")}
                </h2>
            </div>

            {/* Name & Type */}
            <div className={venueStyle.fieldGrid}>
                <div>
                    <label className={venueStyle.label}>
                        {txt("VENUE_NAME")}
                    </label>
                    <input
                        type="text"
                        value={venueName}
                        onChange={(evt) => {
                            return setVenueName(evt.target.value); 
                        }}
                        placeholder={txt("VENUE_NAME_PH")}
                        className={venueStyle.input}
                        required
                    />
                </div>

                <div>
                    <label className={venueStyle.label}>
                        {txt("VENUE_TYPE")}
                    </label>
                    <select
                        value={venueType}
                        onChange={(evt) => {
                            return setVenueType(evt.target.value); 
                        }}
                        className={venueStyle.select}
                        required
                    >
                        <option value="">{txt("VENUE_TYPE_PH")}</option>
                        {venueTypes.map((type) => {
                            return (
                                <option key={type.value} value={type.value}>
                                    {txt(type.labelKey)}
                                </option>
                            ); 
                        })}
                    </select>
                </div>
            </div>

            {/* Event Categories */}
            <div className={venueStyle.categoriesWrapper}>
                <label className={venueStyle.label}>
                    {txt("EVENT_CATEGORIES")}
                </label>
                <div className={venueStyle.categoriesGrid}>
                    {availableCategories.map((item) => {
                        return (
                            <label key={item.value} className={venueStyle.categoryLabel}>
                                <input
                                    type="checkbox"
                                    checked={categories.includes(item.value)}
                                    onChange={(evt) => {
                                        return handleCategoryChange(item.value, evt.target.checked); 
                                    }
                                    }
                                    className={venueStyle.checkbox}
                                />
                                <span>{txt(item.labelKey)}</span>
                            </label>
                        ); 
                    })}
                </div>
            </div>

            {/* Description */}
            <div className={venueStyle.descriptionWrapper}>
                <label className={venueStyle.label}>
                    {txt("DESCRIPTION")}
                </label>

                <textarea
                    rows={3}
                    maxLength={MAX_DESC_LENGTH}
                    value={description}
                    onChange={(evt) => {
                        return setDescription(evt.target.value); 
                    }}
                    placeholder={txt("DESCRIPTION_PH")}
                    className={venueStyle.textarea}
                    required
                />
                <div className={venueStyle.charCounter}>
                    {description.length} / {MAX_DESC_LENGTH}
                </div>
            </div>
        </div>
    );
}
