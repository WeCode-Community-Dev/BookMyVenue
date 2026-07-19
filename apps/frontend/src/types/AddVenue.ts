import React from "react";

export interface AmmenitiesProps {
    selectedAmenities: string[];
    setSelectedAmenities: (val: string[]) => void;
}

export interface LocationFormProps {
    addressLine: string;
    setAddressLine: (val: string) => void;
    city: string;
    setCity: (val: string) => void;
    latitude: number;
    setLatitude: (val: number) => void;
    longitude: number;
    setLongitude: (val: number) => void;
}

export interface PhotoUploadProps {
    files: File[];
    setFiles: (files: File[]) => void;
}

export interface BasicInfoProps {
    venueName: string;
    setVenueName: (val: string) => void;
    venueType: string;
    setVenueType: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    categories: string[];
    setCategories: (val: string[]) => void;
}

export interface PricingTier {
    minGuests: number;
    maxGuests: number;
    price: number;
}

export interface SlotTemplate {
    label: string;
    startDayOffset: number;
    startTime: string;
    endDayOffset: number;
    endTime: string;
    isCustom: boolean;
    customRatePerGuestPerHour?: number;
    pricingTiers: PricingTier[];
}

export interface CapacityAndPricingProps {
    capacityMin: number | "";
    setCapacityMin: (val: number | "") => void;
    capacityMax: number | "";
    setCapacityMax: (val: number | "") => void;
    slotTemplates: SlotTemplate[];
    setSlotTemplates: React.Dispatch<React.SetStateAction<SlotTemplate[]>>;
}

export interface AddVenueFormState {
    venueName: string;
    description: string;
    venueType: string;
    capacityMin: number | "";
    capacityMax: number | "";
    addressLine: string;
    city: string;
    latitude: number;
    longitude: number;
    categories: string[];
    selectedAmenities: string[];
    slotTemplates: SlotTemplate[];
    files: File[];
}
