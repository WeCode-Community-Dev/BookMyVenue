import { create } from 'zustand';

type VenueStore = {
  selectedVenueId: string | null;
  setSelectedVenueId: (id: string | null) => void;
};

export const useVenueStore = create<VenueStore>((set) => ({
  selectedVenueId: null,
  setSelectedVenueId: (id) => set({ selectedVenueId: id }),
}));
