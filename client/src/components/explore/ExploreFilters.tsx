import React from 'react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FILTER_PRICE_STEPS, KERALA_DISTRICTS } from '@/constants';
import {
  VENUE_TYPES,
  SPACE_ATTRIBUTES,
  SEATING_CONFIGURATIONS,
  AMENITIES_LIST,
} from '@/constants/venueConstants';
import type { VenueFilters } from '@/types/venue.types';

interface ExploreFiltersProps {
  isMobileFiltersOpen: boolean;
  setIsMobileFiltersOpen: (val: boolean) => void;
  filters: VenueFilters;
  setFilters: React.Dispatch<React.SetStateAction<VenueFilters>>;
  priceRangeIndex: [number, number];
  setPriceRangeIndex: (val: [number, number]) => void;
  handleClearFilters: () => void;
  isFetching: boolean;
  isLoading: boolean;
}

export function ExploreFilters({
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  filters,
  setFilters,
  priceRangeIndex,
  setPriceRangeIndex,
  handleClearFilters,
  isFetching,
  isLoading,
}: ExploreFiltersProps) {
  const toggleArrayFilter = (key: keyof VenueFilters, value: string) => {
    setFilters((prev) => {
      const currentArray = (prev[key] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [key]: newArray.length > 0 ? newArray : undefined,
      };
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileFiltersOpen(false)}
      />

      <aside
        className={`
        fixed inset-y-0 top-16 left-0 z-50 w-[300px] bg-[var(--bg-primary)] h-full overflow-y-auto transition-transform duration-300
        lg:sticky lg:top-24 lg:w-auto lg:h-auto lg:bg-transparent lg:translate-x-0 lg:pt-0 lg:overflow-visible lg:self-start
        ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div
          className={`
          p-6 lg:p-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:rounded-3xl lg:border lg:border-[var(--bg-grey)] lg:bg-[var(--bg-tertiary)]
          ${isFetching && !isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        >
          <div className="flex items-center justify-between mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Filters</h2>
            <div className="flex items-center gap-1">
              <Button
                onClick={handleClearFilters}
                variant="ghost"
                className="text-[var(--bg-green)] cursor-pointer px-2"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                className="lg:hidden text-[var(--text-secondary)] px-2"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          <Separator className="my-5 hidden lg:block" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Price Range</h3>
            <Slider
              value={priceRangeIndex}
              min={0}
              max={FILTER_PRICE_STEPS.length - 1}
              step={1}
              className="cursor-pointer"
              onValueChange={(val) => setPriceRangeIndex([val[0], val[1]])}
            />
            <div className="flex gap-3 mt-5">
              <div className="flex-1 rounded-2xl border border-[var(--bg-grey)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Min</p>
                <p className="font-medium text-[var(--text-primary)]">
                  ₹{FILTER_PRICE_STEPS[priceRangeIndex[0]]}
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-[var(--bg-grey)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Max</p>
                <p className="font-medium text-[var(--text-primary)]">
                  ₹{FILTER_PRICE_STEPS[priceRangeIndex[1]]}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Venue Type</h3>
            <div className="space-y-4">
              {VENUE_TYPES.map((type) => (
                <div key={type} className="flex items-center gap-3">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.venueType?.includes(type)}
                    onCheckedChange={() => toggleArrayFilter('venueType', type)}
                  />
                  <label htmlFor={`type-${type}`}>{type}</label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">District</h3>
            <Select
              value={filters.district || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  district: value === 'all' ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="w-full rounded-2xl h-12 cursor-pointer">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {KERALA_DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Capacity</h3>
            <RadioGroup
              className="space-y-4"
              value={filters.capacity ? filters.capacity.toString() : 'any'}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  capacity: val === 'any' ? undefined : Number(val),
                }))
              }
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="any" id="cap-any" />
                <label htmlFor="cap-any">Any</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="50" id="cap-50" />
                <label htmlFor="cap-50">1–50 Guests</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="100" id="cap-100" />
                <label htmlFor="cap-100">50–100 Guests</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="300" id="cap-300" />
                <label htmlFor="cap-300">100–300 Guests</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="500" id="cap-500" />
                <label htmlFor="cap-500">300+ Guests</label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Space Type</h3>
            <div className="space-y-4">
              {SPACE_ATTRIBUTES.map((space) => (
                <div key={space} className="flex items-center gap-3">
                  <Checkbox
                    id={`space-${space}`}
                    checked={filters.spaceAttributes?.includes(space)}
                    onCheckedChange={() => toggleArrayFilter('spaceAttributes', space)}
                  />
                  <label htmlFor={`space-${space}`}>{space}</label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Seat Type</h3>
            <div className="space-y-4">
              {SEATING_CONFIGURATIONS.map((seat) => (
                <div key={seat} className="flex items-center gap-3">
                  <Checkbox
                    id={`seat-${seat}`}
                    checked={filters.seatingConfigurations?.includes(seat)}
                    onCheckedChange={() => toggleArrayFilter('seatingConfigurations', seat)}
                  />
                  <label htmlFor={`seat-${seat}`}>{seat}</label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Amenities</h3>
            <div className="space-y-4">
              {AMENITIES_LIST.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={filters.amenities?.includes(amenity)}
                    onCheckedChange={() => toggleArrayFilter('amenities', amenity)}
                  />
                  <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
