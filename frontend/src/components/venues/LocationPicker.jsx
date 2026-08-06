import { useMemo, useState } from "react"
import { ChevronDown, MapPin, X } from "lucide-react"
import LocationPickerModal from "./LocationPickerModal"
import { findCityInGroups } from "../../utils/groupCitiesByDistrict"

export default function LocationPicker({
  locationGroups,
  selectedCityId,
  onSelect,
  onClear,
  label = "Location",
  className = "",
  loading = false,
}) {
  const [open, setOpen] = useState(false)

  const selectedCity = useMemo(
    () => findCityInGroups(locationGroups, selectedCityId),
    [locationGroups, selectedCityId],
  )

  const selectedLabel = selectedCity
    ? `${selectedCity.name}, ${selectedCity.districtName}`
    : loading
      ? "Loading locations..."
      : "All locations"

  return (
    <>
      <div className={`min-w-0 ${className}`}>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={loading}
            className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 text-left text-sm font-semibold text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
          {selectedCityId != null && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear location"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <LocationPickerModal
        open={open}
        onClose={() => setOpen(false)}
        locationGroups={locationGroups}
        loading={loading}
        selectedCityId={selectedCityId}
        onSelect={onSelect}
      />
    </>
  )
}
