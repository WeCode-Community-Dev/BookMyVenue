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
import {
  fetchAmenities,
  getSpaceCategories,
  SpaceCategoryResponse,
  type AmenityResponse,
} from "@/services/venueServices";
import {
  CAPACITY_MAX,
  CAPACITY_MIN,
  PRICE_MAX,
  PRICE_MIN,
  type BrowseSortOption,
} from "@/lib/data/venues-browse";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";


const sortOptions: { value: BrowseSortOption; label: string }[] = [
  { value: "recommended", label: "Most Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating-high", label: "Rating: High to Low" },
  { value: "rating-low", label: "Rating: Low to High" },
];

export function VenuesBrowseFilters() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIds = (searchParams.get("amenityIds") ?? "")
    .split(",")
    .filter(Boolean);

  const selectedCategoryId = searchParams.get("categoryId");


  const [amenities, setAmenities] = useState<AmenityResponse>([]);
  const [categories, setCategories] = useState<SpaceCategoryResponse[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") ?? '');

  useEffect(() => {
    (async ()=>{
      const amenities = await fetchAmenities();
      setAmenities(amenities);
      const categories = await getSpaceCategories();
      setCategories(categories);
    })();
  }, []);
  

  function toggleAmenity(amenityId: string, checked: boolean) {
    const next = checked
      ? [...selectedIds, amenityId]
      : selectedIds.filter((id) => id !== amenityId);

    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) {
      params.set("amenityIds", next.join(","));
    } else {
      params.delete("amenityIds");
    }
    params.set("page", "1");

    router.push(`/venues?${params.toString()}`);
  }

  function selectCategory(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategoryId === categoryId) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", categoryId);
    }
    params.set("page", "1");
    router.push(`/venues?${params.toString()}`);
  }

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("amenityIds");
    params.delete("categoryId");
    params.delete("page");
    router.push(`/venues?${params.toString()}`);
  }

  useEffect(() => {
    const timer = setTimeout(()=>{
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", search);
      params.set("page", "1");
      router.push(`/venues?${params.toString()}`);
    }, 500)

    return () => clearTimeout(timer)
  })

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
  }

  return (
    <aside className="flex flex-col gap-6 rounded-lg bg-surface-container-lowest p-5 shadow-elevation-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-on-surface">Filters</h2>
        <button
          type="button"
          onClick={resetFilters}
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
            value={search}
            onChange={handleSearchChange}
            placeholder="Search venues or location..."
            className="h-10 pl-9 bg-background"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium text-on-surface">Category</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "border-surface-tint bg-surface-tint text-on-primary"
                    : "border-outline-variant/60 bg-transparent text-on-surface-variant hover:border-surface-tint/50 hover:text-on-surface",
                )}
                aria-pressed={isSelected}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-on-surface">Capacity</Label>
          <span className="text-xs text-on-surface-variant">
          </span>
        </div>
        <Slider
          min={CAPACITY_MIN}
          max={CAPACITY_MAX}
          step={5}
          // value={[filters.minCapacity, filters.maxCapacity]}
          onValueChange={() => {
            // update({ minCapacity: min, maxCapacity: max });
          }}
        />
      </div> */}

      {/* <div className="flex flex-col gap-3">
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
              className="h-10 pl-7 bg-background"
            />
          </div>
        </div>
      </div> */}

      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium text-on-surface">Amenities</Label>
        <div className="flex flex-col gap-3">
          {amenities.map((amenity) => (
            <label
              key={amenity.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedIds.includes(amenity.id)}
                onCheckedChange={(checked) =>
                  toggleAmenity(amenity.id, checked === true)
                }
              />
              <span className="text-sm text-on-surface">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-on-surface">Sort By</Label>
        <Select
          // value={filters.sort}
          // onValueChange={(value) =>
          //   update({ sort: value as BrowseSortOption })
          // }
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
      </div> */}
    </aside>
  );
}
