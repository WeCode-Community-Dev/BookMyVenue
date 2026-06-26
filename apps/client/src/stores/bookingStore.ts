import { create } from "zustand";

interface BookingState {
    selectedSessions: number[];
    toggleSession: (sessionId: number) => void;
    clearSessions: () => void;
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
    phone: string;
    setPhone: (phone: string) => void;
    purpose: string;
    setPurpose: (purpose: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    selectedSessions: [],
    toggleSession: (sessionId) =>
        set((state) => ({
            selectedSessions: state.selectedSessions.includes(sessionId)
                ? state.selectedSessions.filter((id) => id !== sessionId)
                : [...state.selectedSessions, sessionId],
        })),
    clearSessions: () => set({ selectedSessions: [] }),
    selectedDate: null,
    setSelectedDate: (date) => set({ selectedDate: date }),
    phone: "",
    setPhone: (phone) => set({ phone }),
    purpose: "",
    setPurpose: (purpose) => set({ purpose }),
}));
