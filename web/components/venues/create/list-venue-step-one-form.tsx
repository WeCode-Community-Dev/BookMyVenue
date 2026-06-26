"use client";

import { MapPin } from "lucide-react";

import { IconInput } from "@/components/auth/icon-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ListVenueBasicsForm } from "@/lib/data/list-venue";
import { timezoneOptions } from "@/lib/data/list-venue";
import MapDialogBox from "@/components/map/map-dialogbox";

type ListVenueStepOneFormProps = {
  value: ListVenueBasicsForm;
  onChange: (value: ListVenueBasicsForm) => void;
};

export function ListVenueStepOneForm({
  value,
  onChange,
}: ListVenueStepOneFormProps) {
  function updateField<K extends keyof ListVenueBasicsForm>(
    field: K,
    fieldValue: ListVenueBasicsForm[K]
  ) {
    onChange({ ...value, [field]: fieldValue });
  }
  console.log('value', value);

  return (
    <div className="flex flex-col gap-5">
      <IconInput
        label="Venue Name"
        name="name"
        placeholder="e.g. The Grand Oak Ballroom"
        value={value.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm font-medium text-on-surface">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell us about the space, its history, and what makes it unique..."
          value={value.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="min-h-[120px] resize-none"
        />
      </div>
      <IconInput
        label="Street Address"
        name="address"
        placeholder="Enter street address"
        icon={<MapPin />}
        value={value.address}
        onChange={(e) => updateField("address", e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="coordinates"
          className="text-sm font-medium text-on-surface"
        >
          Location Coordinates
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <MapDialogBox 
          onLocationSelect={(lat: number, lng: number) => {
            onChange({ ...value, latitude: lat.toString(), longitude: lng.toString() });
          }} 
          initialLocation={{ lat: parseFloat(value.latitude), lng: parseFloat(value.longitude) }} />
          <Input
            id="coordinates"
            name="coordinates"
            placeholder="Latitude, Longitude"
            value={ value.latitude && value.longitude ? `${value.latitude},${value.longitude}` : ""}
            className="h-10"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="country" className="text-sm font-medium text-on-surface">
            Country
          </Label>
          <Input
            id="country"
            name="country"
            value={value.country}
            onChange={(e) => updateField("country", e.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="state" className="text-sm font-medium text-on-surface">
            State / Province
          </Label>
          <Input
            id="state"
            name="state"
            value={value.state}
            onChange={(e) => updateField("state", e.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="city" className="text-sm font-medium text-on-surface">
            City
          </Label>
          <Input
            id="city"
            name="city"
            value={value.city}
            onChange={(e) => updateField("city", e.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="city" className="text-sm font-medium text-on-surface">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={value.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            className="h-10"
            placeholder="pin code"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <Label htmlFor="timezone" className="text-sm font-medium text-on-surface">
          Timezone
        </Label>
        <Select
          value={value.timezone}
          onValueChange={(timezone) => updateField("timezone", timezone)}
        >
          <SelectTrigger id="timezone" className="h-14 w-full">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezoneOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
