import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const phoneCountries = [
  { code: "US", dial: "+1", label: "US" },
  { code: "IN", dial: "+91", label: "IN" },
  { code: "GB", dial: "+44", label: "UK" },
  { code: "CA", dial: "+1", label: "CA" },
  { code: "AU", dial: "+61", label: "AU" },
  { code: "DE", dial: "+49", label: "DE" },
] as const;

export type PhoneCountryCode = (typeof phoneCountries)[number]["code"];

type PhoneInputProps = {
  countryCode: PhoneCountryCode;
  value: string;
  onChange: (value: string) => void;
};

const selectClassName = cn(
  "h-10 shrink-0 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
);

export function PhoneInput({
  countryCode,
  value,
  onChange,
}: PhoneInputProps) {
  const selectedCountry =
    phoneCountries.find((country) => country.code === countryCode) ??
    phoneCountries[0];

    const [selectedCountryState, setSelectedCountryState] = useState<typeof phoneCountries[number]>(selectedCountry);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="phone-number" className="text-sm font-medium text-on-surface">
        Phone Number (Optional)
      </Label>
      <div className="flex gap-2">
        <select
          id="phone-country"
          aria-label="Country code"
          value={countryCode}
          onChange={(e) =>
            setSelectedCountryState(phoneCountries.find((country) => country.code === e.target.value) ?? phoneCountries[0])
          }
          className={cn(selectClassName, "w-[88px]")}
        >
          {phoneCountries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label} {country.dial}
            </option>
          ))}
        </select>
        <Input
          id="phone-number"
          type="tel"
          name="phone"
          autoComplete="tel-national"
          placeholder="(555) 000-0000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 min-w-0 flex-1"
        />
      </div>
      <span className="sr-only">
        Selected country dial code: {selectedCountry.dial}
      </span>
    </div>
  );
}
