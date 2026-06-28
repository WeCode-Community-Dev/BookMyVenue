"use client";

import { MapPin } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type {
  AmenityResponse,
  SpaceCategoryResponse,
} from "@/services/venueServices";
import {
  CAPACITY_MAX,
  CAPACITY_MIN,
  PRICE_MAX,
  PRICE_MIN,
  type BrowseFilters,
  type BrowseSortOption,
  defaultBrowseFilters,
} from "@/lib/data/venues-browse";
import { cn } from "@/lib/utils";

type VenuesBrowseFiltersProps = {
  filters: BrowseFilters;
  categories: SpaceCategoryResponse[];
  amenities: AmenityResponse;
  onChange: (filters: BrowseFilters) => void;
  onReset: () => void;
};

const sortOptions: { value: BrowseSortOption; label: string }[] = [
  { value: "recommended", label: "Most Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating-high", label: "Rating: High to Low" },
  { value: "rating-low", label: "Rating: Low to High" },
];

export function VenuesBrowseFilters({
  filters,
  categories,
  amenities,
  onChange,
  onReset,
}: VenuesBrowseFiltersProps) {
  function update(partial: Partial<BrowseFilters>) {
    onChange({ ...filters, ...partial, page: 1 });
  }

  function toggleAmenity(amenityId: string) {
    const amenityIds = filters.amenityIds.includes(amenityId)
      ? filters.amenityIds.filter((id) => id !== amenityId)
      : [...filters.amenityIds, amenityId];
    update({ amenityIds });
  }

  return (
    <aside className="flex flex-col gap-6 rounded-lg bg-surface-container-lowest p-5 shadow-elevation-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-on-surface">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-surface-tint hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-on-surface">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            value={filters.location}
            onChange={(e) => update({ location: e.target.value })}
            placeholder="City or neighborhood"
            className="h-10 pl-9 bg-background"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium text-on-surface">Category</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = filters.categoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  update({
                    categoryId: isSelected ? null : category.id,
                  })
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "border-surface-tint bg-surface-tint text-on-primary"
                    : "border-outline-variant/60 bg-transparent text-on-surface-variant hover:border-surface-tint/50 hover:text-on-surface",
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-on-surface">Capacity</Label>
          <span className="text-xs text-on-surface-variant">
            {filters.minCapacity} - {filters.maxCapacity >= CAPACITY_MAX ? `${CAPACITY_MAX}+` : filters.maxCapacity}
          </span>
        </div>
        <Slider
          min={CAPACITY_MIN}
          max={CAPACITY_MAX}
          step={5}
          value={[filters.minCapacity, filters.maxCapacity]}
          onValueChange={(value) => {
            const [min, max] = value;
            update({ minCapacity: min, maxCapacity: max });
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium text-on-surface">
          Price Range (per hour)
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
              $
            </span>
            <Input
              type="number"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={filters.minPrice}
              onChange={(e) =>
                update({
                  minPrice: Math.min(
                    parseInt(e.target.value, 10) || PRICE_MIN,
                    filters.maxPrice,
                  ),
                })
              }
              className="h-10 pl-7 bg-background"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
              $
            </span>
            <Input
              type="number"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={filters.maxPrice}
              onChange={(e) =>
                update({
                  maxPrice: Math.max(
                    parseInt(e.target.value, 10) || PRICE_MAX,
                    filters.minPrice,
                  ),
                })
              }
              className="h-10 pl-7 bg-background"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium text-on-surface">Amenities</Label>
        <div className="flex flex-col gap-3">
          {amenities.map((amenity) => (
            <label
              key={amenity.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={filters.amenityIds.includes(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
              <span className="text-sm text-on-surface">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-on-surface">Sort By</Label>
        <Select
          value={filters.sort}
          onValueChange={(value) =>
            update({ sort: value as BrowseSortOption })
          }
        >
          <SelectTrigger className="h-10 w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
