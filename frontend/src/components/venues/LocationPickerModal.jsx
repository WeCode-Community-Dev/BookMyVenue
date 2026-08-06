import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, MapPin, Search, X } from "lucide-react"
import {
  filterCitiesForPicker,
  sortLocationGroups,
} from "../../utils/groupCitiesByDistrict"

const cityButtonBase =
  "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all"
const cityButtonActive = "border-primary bg-primary/10 text-primary"
const cityButtonInactive =
  "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"

function CityButton({ city, districtName, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(city)}
      className={`${cityButtonBase} ${selected ? cityButtonActive : cityButtonInactive}`}
    >
      <span className="block truncate">{city.shortName ?? city.name}</span>
      {districtName && (
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{districtName}</span>
      )}
    </button>
  )
}

export default function LocationPickerModal({
  open,
  onClose,
  locationGroups,
  loading = false,
  selectedCityId,
  onSelect,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedDistrictIds, setExpandedDistrictIds] = useState(() => new Set())

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setExpandedDistrictIds(new Set())
    }
  }, [open])

  const districtsWithCities = useMemo(
    () => sortLocationGroups(locationGroups),
    [locationGroups],
  )

  const searchResults = useMemo(
    () => filterCitiesForPicker(locationGroups, searchQuery),
    [locationGroups, searchQuery],
  )

  const isSearching = searchQuery.trim().length > 0

  const toggleDistrict = (districtId) => {
    setExpandedDistrictIds((current) => {
      const next = new Set(current)
      if (next.has(districtId)) {
        next.delete(districtId)
      } else {
        next.add(districtId)
      }
      return next
    })
  }

  const handleSelect = (city) => {
    onSelect(city)
    onClose()
  }

  const handleSelectAll = () => {
    onSelect(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="Close location picker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-picker-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative flex max-h-[min(85vh,720px)] w-full max-w-xl flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_24px_60px_rgba(27,36,29,0.18)]"
          >
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Location
                  </span>
                  <h2
                    id="location-picker-title"
                    className="mt-1 font-serif text-2xl font-semibold text-foreground"
                  >
                    Choose a city
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick from available cities in our service areas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search city or district..."
                  autoComplete="off"
                  className="h-11 w-full rounded-full border border-border bg-background py-2 pl-10 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`mb-4 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                  selectedCityId == null
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm font-semibold">All locations</span>
              </button>

              {isSearching && searchResults.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No matching cities in our service areas.
                </p>
              )}

              {isSearching && searchResults.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {searchResults.map((city) => (
                    <CityButton
                      key={city.id}
                      city={city}
                      districtName={city.districtName}
                      selected={selectedCityId === city.id}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {!isSearching && loading && (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading locations...</p>
              )}

              {!isSearching && !loading && districtsWithCities.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No cities available yet.
                </p>
              )}

              {!isSearching && districtsWithCities.length > 0 && (
                <div className="space-y-2">
                  {districtsWithCities.map((district) => {
                    const isExpanded = expandedDistrictIds.has(district.id)

                    return (
                      <div
                        key={district.id}
                        className="overflow-hidden rounded-xl border border-border bg-card"
                      >
                        <button
                          type="button"
                          onClick={() => toggleDistrict(district.id)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-muted/40"
                        >
                          <span className="min-w-0 flex-1 font-semibold text-foreground">
                            {district.name}
                          </span>
                          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                            {district.cities.length}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="grid grid-cols-2 gap-2 border-t border-border p-3 sm:grid-cols-3">
                            {district.cities.map((city) => (
                              <CityButton
                                key={city.id}
                                city={city}
                                selected={selectedCityId === city.id}
                                onSelect={handleSelect}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
