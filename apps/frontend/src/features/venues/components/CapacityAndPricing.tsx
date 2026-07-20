"use client";

import { CapacityAndPricingProps, PricingTier, SlotTemplate } from "@/types/AddVenue";
import { Clock, Plus, Trash2, Users } from "lucide-react";

import React from "react";
import { getText } from "@/lib/language/LanguageHelper";
import { useLanguage } from "@/store/AppConfigReducer";
import { useSelector } from "react-redux";
import { venueStyle } from "@/features/venues/styles/VenueStyle";

const txt = (textName: string) => {
    return getText(textName, "CAPACITY_PRICING"); 
};

export default function CapacityAndPricing({
    capacityMin,
    setCapacityMin,
    capacityMax,
    setCapacityMax,
    slotTemplates,
    setSlotTemplates,
}: CapacityAndPricingProps) {
    useSelector(useLanguage);

    const addSlotTemplate = () => {
        setSlotTemplates([
            ...slotTemplates,
            {
                label: "New Slot",
                startDayOffset: 0,
                startTime: "09:00",
                endDayOffset: 0,
                endTime: "18:00",
                isCustom: false,
                customRatePerGuestPerHour: 0,
                pricingTiers: [
                    { minGuests: 1, maxGuests: 100, price: 1000 }
                ],
            },
        ]);
    };

    const removeSlotTemplate = (index: number) => {
        setSlotTemplates(
            slotTemplates.filter((_s, idx) => {
                return idx !== index; 
            })
        );
    };

    const updateSlotTemplate = (
        index: number,
        field: keyof SlotTemplate,
        value: any
    ) => {
        const updated = [
            ...slotTemplates
        ];
        updated[ index ] = { ...updated[ index ], [ field ]: value };
        setSlotTemplates(updated);
    };

    const addPricingTier = (slotIndex: number) => {
        const updated = [
            ...slotTemplates
        ];

        const tiers = updated[ slotIndex ].pricingTiers || [
        ];
        const last = tiers[ tiers.length - 1 ];
        const nextMin = last ? Number(last.maxGuests) + 1 : 1;
        const nextMax = last ? Number(last.maxGuests) + 100 : 100;
        updated[ slotIndex ] = {
            ...updated[ slotIndex ],
            pricingTiers: [
                ...tiers, { minGuests: nextMin, maxGuests: nextMax, price: 1000 }
            ],
        };
        setSlotTemplates(updated);
    };

    const removePricingTier = (slotIndex: number, tierIndex: number) => {
        const updated = [
            ...slotTemplates
        ];

        const tiers = updated[ slotIndex ].pricingTiers || [
        ];
        updated[ slotIndex ] = {
            ...updated[ slotIndex ],
            pricingTiers: tiers.filter((_t, idx) => {
                return idx !== tierIndex; 
            }),
        };
        setSlotTemplates(updated);
    };

    const updatePricingTier = (
        slotIndex: number,
        tierIndex: number,
        field: keyof PricingTier,
        value: number
    ) => {
        const updated = [
            ...slotTemplates
        ];

        const newTiers = [
            ...updated[ slotIndex ].pricingTiers
        ];
        newTiers[ tierIndex ] = { ...newTiers[ tierIndex ], [ field ]: value };
        updated[ slotIndex ] = { ...updated[ slotIndex ], pricingTiers: newTiers };
        setSlotTemplates(updated);
    };

    return (
        <div className={venueStyle.card}>
            {/* Header */}
            <div className={venueStyle.headerWrapper}>
                <Users className={venueStyle.headerIcon} />
                <h2 className={venueStyle.headerTitle}>
                    {txt("HEADING")}
                </h2>
            </div>

            {/* Capacity inputs */}
            <div className={venueStyle.rowGrid2}>
                <div>
                    <label className={venueStyle.label}>
                        {txt("MIN_GUESTS")}
                    </label>
                    <input
                        type="number"
                        value={capacityMin}
                        onChange={(evt) => {
                            const val = evt.target.value;
                            return setCapacityMin(val === "" ? "" : Number(val));
                        }}
                        placeholder={txt("MIN_PLACEHOLDER")}
                        className={venueStyle.input}
                        required
                    />
                </div>

                <div>
                    <label className={venueStyle.label}>
                        {txt("MAX_GUESTS")}
                    </label>
                    <input
                        type="number"
                        value={capacityMax}
                        onChange={(evt) => {
                            const val = evt.target.value;
                            return setCapacityMax(val === "" ? "" : Number(val));
                        }}
                        placeholder={txt("MAX_PLACEHOLDER")}
                        className={venueStyle.input}
                        required
                    />
                </div>
            </div>

            <hr className={venueStyle.sectionDivider} />

            {/* Slot Templates */}
            <div className={venueStyle.slotSectionWrapper}>
                <div className={venueStyle.slotSectionTopBar}>
                    <div>
                        <div className={venueStyle.slotSectionTitle}>
                            <Clock className={venueStyle.headerIcon} />
                            <h3 className={venueStyle.slotSectionHeading}>
                                {txt("SLOTS_HEADING")}
                            </h3>
                        </div>
                        <p className={venueStyle.slotSectionSubtitle}>
                            {txt("SLOTS_SUBTITLE")}
                        </p>
                    </div>
                </div>

                {slotTemplates.map((slot, slotIdx) => {
                    return (
                        <div key={slotIdx} className={venueStyle.slotCard}>
                            <div className={venueStyle.slotCardHeader}>
                                <span className={venueStyle.slotCardTitle}>
                                    {txt("SLOT_TITLE")}{slotIdx + 1}
                                </span>
                                {slotTemplates.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            return removeSlotTemplate(slotIdx); 
                                        }}
                                        className={venueStyle.removeSlotBtn}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        {txt("REMOVE_SLOT")}
                                    </button>
                                )}
                            </div>

                            {/* Slot field grid */}
                            <div className={venueStyle.slotInputsGrid}>
                                <div>
                                    <label className={venueStyle.slotFieldLabel}>
                                        {txt("SLOT_LABEL")}
                                    </label>
                                    <input
                                        type="text"
                                        value={slot.label}
                                        onChange={(evt) => {
                                            return updateSlotTemplate(slotIdx, "label", evt.target.value); 
                                        }
                                        }
                                        placeholder={txt("SLOT_LABEL_PH")}
                                        className={venueStyle.slotInput}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={venueStyle.slotFieldLabel}>
                                        {txt("START_TIME")}
                                    </label>
                                    <input
                                        type="time"
                                        value={slot.startTime}
                                        onChange={(evt) => {
                                            return updateSlotTemplate(slotIdx, "startTime", evt.target.value); 
                                        }
                                        }
                                        className={venueStyle.slotInput}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={venueStyle.slotFieldLabel}>
                                        {txt("END_TIME")}
                                    </label>
                                    <input
                                        type="time"
                                        value={slot.endTime}
                                        onChange={(evt) => {
                                            return updateSlotTemplate(slotIdx, "endTime", evt.target.value); 
                                        }
                                        }
                                        className={venueStyle.slotInput}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={venueStyle.slotFieldLabel}>
                                        {txt("START_DAY_OFFSET")}
                                    </label>
                                    <select
                                        value={slot.startDayOffset}
                                        onChange={(evt) => {
                                            return updateSlotTemplate(
                                                slotIdx, 
                                                "startDayOffset", 
                                                Number(evt.target.value)
                                            ); 
                                        }
                                        }
                                        className={venueStyle.slotInput}
                                    >
                                        <option value={-1}>{txt("PREV_DAY")}</option>
                                        <option value={0}>{txt("SAME_DAY")}</option>
                                        <option value={1}>{txt("NEXT_DAY")}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={venueStyle.slotFieldLabel}>
                                        {txt("END_DAY_OFFSET")}
                                    </label>
                                    <select
                                        value={slot.endDayOffset}
                                        onChange={(evt) => {
                                            return updateSlotTemplate(
                                                slotIdx, 
                                                "endDayOffset", 
                                                Number(evt.target.value)
                                            ); 
                                        }
                                        }
                                        className={venueStyle.slotInput}
                                    >
                                        <option value={0}>{txt("SAME_DAY")}</option>
                                        <option value={1}>{txt("NEXT_DAY")}</option>
                                        <option value={2}>{txt("TWO_DAYS")}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Custom pricing toggle */}
                            <div className={venueStyle.customPricingToggle}>
                                <input
                                    type="checkbox"
                                    id={`isCustom-${slotIdx}`}
                                    checked={slot.isCustom}
                                    onChange={(evt) => {
                                        return updateSlotTemplate(slotIdx, "isCustom", evt.target.checked); 
                                    }
                                    }
                                    className={venueStyle.checkbox}
                                />
                                <label
                                    htmlFor={`isCustom-${slotIdx}`}
                                    className={venueStyle.customPricingLabel}
                                >
                                    {txt("CUSTOM_TOGGLE")}
                                </label>
                            </div>

                            {/* Custom rate or Flat tiers */}
                            {slot.isCustom
                                ? (
                                    <div className={venueStyle.customPricingBox}>
                                        <label className={venueStyle.slotFieldLabel}>
                                            {txt("CUSTOM_RATE_LABEL")}
                                        </label>
                                        <input
                                            type="number"
                                            value={slot.customRatePerGuestPerHour || 0}
                                            onChange={(evt) => {
                                                return updateSlotTemplate(
                                                    slotIdx,
                                                    "customRatePerGuestPerHour",
                                                    Number(evt.target.value)
                                                ); 
                                            }
                                            }
                                            placeholder={txt("CUSTOM_RATE_PH")}
                                            className={venueStyle.slotInput}
                                            required
                                            min="0"
                                        />
                                    </div>
                                )
                                : (
                                    <div className={venueStyle.flatPricingBox}>
                                        <span className={venueStyle.flatPricingTitle}>
                                            {txt("TIERS_HEADING")}
                                        </span>

                                        <div className={venueStyle.tiersSpaceY}>
                                            {slot.pricingTiers.map((tier, tierIdx) => {
                                                return (
                                                    <div key={tierIdx} className={venueStyle.tierRow}>
                                                        <div className={venueStyle.tierGrid}>
                                                            <div>
                                                                <label className={venueStyle.tierFieldLabel}>
                                                                    {txt("TIER_MIN")}
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={tier.minGuests}
                                                                    onChange={(evt) => {
                                                                        return updatePricingTier(
                                                                            slotIdx, 
                                                                            tierIdx, 
                                                                            "minGuests", 
                                                                            Number(evt.target.value)
                                                                        ); 
                                                                    }
                                                                    }
                                                                    className={venueStyle.pricingInput}
                                                                    min="1"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className={venueStyle.tierFieldLabel}>
                                                                    {txt("TIER_MAX")}
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={tier.maxGuests}
                                                                    onChange={(evt) => {
                                                                        return updatePricingTier(
                                                                            slotIdx, 
                                                                            tierIdx, 
                                                                            "maxGuests",
                                                                            Number(evt.target.value)
                                                                        ); 
                                                                    }
                                                                    }
                                                                    className={venueStyle.pricingInput}
                                                                    min="1"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className={venueStyle.tierFieldLabel}>
                                                                    {txt("TIER_PRICE")}
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={tier.price}
                                                                    onChange={(evt) => {
                                                                        return updatePricingTier(
                                                                            slotIdx,
                                                                            tierIdx,
                                                                            "price",
                                                                            Number(evt.target.value)
                                                                        );
                                                                    }}
                                                                    className={venueStyle.pricingInput}
                                                                    min="0"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        {slot.pricingTiers.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    return removePricingTier(slotIdx, tierIdx); 
                                                                }}
                                                                className={venueStyle.removeTierBtn}
                                                                title={txt("REMOVE_TIER")}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ); 
                                            })}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                return addPricingTier(slotIdx); 
                                            }}
                                            className={venueStyle.addTierBtn}
                                        >
                                            <Plus className="h-3 w-3" />
                                            {txt("ADD_TIER")}
                                        </button>
                                    </div>
                                )}
                        </div>
                    ); 
                })}

                <button
                    type="button"
                    onClick={addSlotTemplate}
                    className={venueStyle.addSlotBtn}
                >
                    <Plus className="h-3.5 w-3.5" />
                    {txt("ADD_SLOT")}
                </button>
            </div>
        </div>
    );
}
