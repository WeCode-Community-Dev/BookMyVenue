"use client";

import { AddVenueFormState, SlotTemplate } from "@/types/AddVenue";

import ActionButtons from "@/components/global/ActionButtons";
import Ammenities from "@/components/global/Ammenities";
import BasicInfo from "./BasicInfo";
import CapacityAndPricing from "./CapacityAndPricing";
import LocationForm from "@/components/global/LocationForm";
import PhotoUpload from "@/components/global/PhotoUpload";
import VenueHeader from "@/components/global/venueheader";
import VerifyBooking from "@/components/global/booking/VerifyBooking";
import { getText } from "@/lib/language/LanguageHelper";
import { useAuthService } from "@/features/auth/services/AuthService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { venueStyle } from "../styles/VenueStyle";

const tv = (key: string, append?: Record<string, string>) => {
    return getText(key, "ADD_VENUE", append); 
};

const validatePricingTiers = (tiers: any[], label: string): string | null => {
    if (!tiers || tiers.length === 0) {
        return tv("ERR_TIER_REQUIRED", { label });
    }

    for (const tier of tiers) {
        if (Number(tier.minGuests) < 1 || Number(tier.maxGuests) < 1) {
            return tv("ERR_TIER_POSITIVE", { label });
        }

        if (Number(tier.minGuests) > Number(tier.maxGuests)) {
            return tv("ERR_TIER_MIN_MAX", { label });
        }

        if (Number(tier.price) < 0) {
            return tv("ERR_TIER_NEGATIVE_PRICE", { label });
        }
    }
    return null;
};

const validateSlotTemplates = (templates: any[]): string | null => {
    if (templates.length === 0) {
        return tv("ERR_SLOT_REQUIRED");
    }

    for (const slot of templates) {
        if (!slot.label.trim()) {
            return tv("ERR_SLOT_NO_LABEL");
        }

        if (!slot.startTime || !slot.endTime) {
            return tv("ERR_SLOT_TIMES", { label: slot.label });
        }

        if (slot.isCustom) {
            const hasInvalidRate = typeof slot.customRatePerGuestPerHour === "undefined" ||
                Number(slot.customRatePerGuestPerHour) < 0;
            if (hasInvalidRate) {
                return tv("ERR_SLOT_CUSTOM_RATE", { label: slot.label });
            }
        } else {
            const tiersError = validatePricingTiers(slot.pricingTiers, slot.label);
            if (tiersError) {
                return tiersError;
            }
        }
    }
    return null;
};

const formatSlotTemplates = (templates: any[]): any[] => {
    return templates.map((slot) => {
        const base = {
            label: slot.label,
            startDayOffset: Number(slot.startDayOffset || 0),
            startTime: slot.startTime,
            endDayOffset: Number(slot.endDayOffset || 0),
            endTime: slot.endTime,
            isCustom: slot.isCustom,
        };
        if (slot.isCustom) {
            return {
                ...base,
                customRatePerGuestPerHour: Number(slot.customRatePerGuestPerHour || 0),
                pricingTiers: [
                ],
            };
        }
        return {
            ...base,
            pricingTiers: slot.pricingTiers.map((tier: any) => {
                return {
                    minGuests: Number(tier.minGuests),
                    maxGuests: Number(tier.maxGuests),
                    price: Number(tier.price),
                };
            }),
        };
    });
};

const createVenueFormData = (form: AddVenueFormState): FormData => {
    const formData = new FormData();
    formData.append("name", form.venueName);
    formData.append("description", form.description);
    formData.append("venueType", form.venueType);
    formData.append("capacityMin", String(form.capacityMin));
    formData.append("capacityMax", String(form.capacityMax));
    formData.append("addressLine", form.addressLine);
    formData.append("city", form.city);
    formData.append("latitude", String(form.latitude));
    formData.append("longitude", String(form.longitude));
    formData.append("categories", JSON.stringify(form.categories));
    formData.append("amenities", JSON.stringify(form.selectedAmenities));

    const formattedSlots = formatSlotTemplates(form.slotTemplates);
    formData.append("slotTemplates", JSON.stringify(formattedSlots));

    form.files.forEach((file) => {
        formData.append("images", file);
    });
    return formData;
};

const AddVenue = () => {
    const { apiFetch } = useAuthService();
    const router = useRouter();

    const [
        isOpen, setIsOpen
    ] = useState(false);

    const [
        submitting, setSubmitting
    ] = useState(false);

    const [
        errorMsg, setErrorMsg
    ] = useState("");

    const [
        form, setForm
    ] = useState<AddVenueFormState>({
        venueName: "",
        description: "",
        venueType: "RESORT",
        capacityMin: "",
        capacityMax: "",
        addressLine: "",
        city: "",
        latitude: 12.9716,
        longitude: 77.5946,
        categories: [
        ],
        selectedAmenities: [
        ],
        slotTemplates: [
            {
                label: "Morning",
                startDayOffset: 0,
                startTime: "08:00",
                endDayOffset: 0,
                endTime: "13:00",
                isCustom: false,
                pricingTiers: [
                    { minGuests: 1, maxGuests: 100, price: 5000 },
                    { minGuests: 101, maxGuests: 250, price: 9000 }
                ],
                customRatePerGuestPerHour: 0
            },
            {
                label: "Evening",
                startDayOffset: 0,
                startTime: "17:00",
                endDayOffset: 0,
                endTime: "22:00",
                isCustom: false,
                pricingTiers: [
                    { minGuests: 1, maxGuests: 100, price: 7000 },
                    { minGuests: 101, maxGuests: 250, price: 12000 }
                ],
                customRatePerGuestPerHour: 0
            }
        ],
        files: [
        ]
    });

    const updateField = <K extends keyof AddVenueFormState>(
        key: K,
        value: AddVenueFormState[K]
    ) => {
        setForm((prev) => {
            return {
                ...prev,
                [ key ]: value
            }; 
        });
    };

    const setSlotTemplates = (
        val: React.SetStateAction<SlotTemplate[]>
    ) => {
        setForm((prev) => {
            return {
                ...prev,
                slotTemplates: typeof val === "function" ? val(prev.slotTemplates) : val
            }; 
        });
    };

    const handleSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault();
        setErrorMsg("");
        setSubmitting(true);

        const isFormValid = form.files.length > 0 && form.categories.length > 0 && form.selectedAmenities.length > 0;
        if (!isFormValid) {
            setErrorMsg(tv("ERR_REQUIRED_FIELDS"));
            setSubmitting(false);
            return;
        }

        const validationError = validateSlotTemplates(form.slotTemplates);
        if (validationError) {
            setErrorMsg(validationError);
            setSubmitting(false);
            return;
        }

        try {
            const formData = createVenueFormData(form);

            await apiFetch("/venue/add", {
                method: "POST",
                body: formData,
            });

            router.push("/venues");
        } catch (errorObj: any) {
            console.error(errorObj);
            setErrorMsg(errorObj.message || tv("ERR_CREATE_FAILED"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={venueStyle.pageWrapper}>
            <VerifyBooking
                isOpen={isOpen}
                onClose={() => {
                    return setIsOpen(false); 
                }}
            />
            <VenueHeader />
            <form onSubmit={handleSubmit}>
                {errorMsg && (
                    <div className={venueStyle.errorBanner}>
                        {errorMsg}
                    </div>
                )}
                
                <div className={venueStyle.formBox}>
                    {/* Left */}
                    <div>
                        <BasicInfo 
                            venueName={form.venueName}
                            setVenueName={(val) => {
                                return updateField("venueName", val); 
                            }}
                            venueType={form.venueType}
                            setVenueType={(val) => {
                                return updateField("venueType", val); 
                            }}
                            description={form.description}
                            setDescription={(val) => {
                                return updateField("description", val); 
                            }}
                            categories={form.categories}
                            setCategories={(val) => {
                                return updateField("categories", val); 
                            }}
                        />
                        <CapacityAndPricing 
                            capacityMin={form.capacityMin}
                            setCapacityMin={(val) => {
                                return updateField("capacityMin", val); 
                            }}
                            capacityMax={form.capacityMax}
                            setCapacityMax={(val) => {
                                return updateField("capacityMax", val); 
                            }}
                            slotTemplates={form.slotTemplates}
                            setSlotTemplates={setSlotTemplates}
                        />
                        <Ammenities 
                            selectedAmenities={form.selectedAmenities}
                            setSelectedAmenities={(val) => {
                                return updateField("selectedAmenities", val); 
                            }}
                        />
                        <PhotoUpload 
                            files={form.files}
                            setFiles={(val) => {
                                return updateField("files", val); 
                            }}
                        />
                    </div>
                    {/* Right */}
                    <LocationForm 
                        addressLine={form.addressLine}
                        setAddressLine={(val) => {
                            return updateField("addressLine", val); 
                        }}
                        city={form.city}
                        setCity={(val) => {
                            return updateField("city", val); 
                        }}
                        latitude={form.latitude}
                        setLatitude={(val) => {
                            return updateField("latitude", val); 
                        }}
                        longitude={form.longitude}
                        setLongitude={(val) => {
                            return updateField("longitude", val); 
                        }}
                    />
                </div>
                
                {submitting
                    ? (
                        <div className={venueStyle.submittingWrapper}>
                            <span className={venueStyle.submittingText}>
                                {tv("SUBMITTING")}
                            </span>
                        </div>
                    )
                    : (
                        <ActionButtons />
                    )}
            </form>
        </div>
    );
};

export default AddVenue;
