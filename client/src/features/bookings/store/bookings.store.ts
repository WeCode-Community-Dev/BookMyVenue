import { create } from 'zustand';
import type { BookingDetails } from '../types/bookings.types';

interface BookingsState {
  draft: BookingDetails | null;
  setDraft: (draft: BookingDetails) => void;
  clearDraft: () => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
