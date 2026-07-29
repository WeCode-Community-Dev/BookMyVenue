import { create } from 'zustand';

type UserStore = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
