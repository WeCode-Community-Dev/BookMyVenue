import { create } from "zustand";
import type { VenueType } from "@/lib/types";

export interface Filters {
  q: string;
  type: VenueType | "";
  min_price: string;
  max_price: string;
  min_capacity: string;
}

interface FilterState extends Filters {
  set: (patch: Partial<Filters>) => void;
}

const defaults: Filters = {
  q: "",
  type: "",
  min_price: "",
  max_price: "",
  min_capacity: "",
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaults,
  set: (patch) => set(patch),
}));
