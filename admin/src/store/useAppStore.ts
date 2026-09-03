import { create } from "zustand";

interface AppState {
  activeVenueId: string | null;
  activeVenueName: string | null;
  activeVenueStatus: string | null;
  lastVenueSubRoute: string;
  setActiveVenue: (
    id: string | null,
    name: string | null,
    status?: string | null,
  ) => void;
  setLastVenueSubRoute: (route: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeVenueId: null,
  activeVenueName: null,
  activeVenueStatus: null,
  lastVenueSubRoute: "bookings",
  setActiveVenue: (id, name, status = null) =>
    set({
      activeVenueId: id,
      activeVenueName: name,
      activeVenueStatus: status,
    }),
  setLastVenueSubRoute: (route) => set({ lastVenueSubRoute: route }),
}));
