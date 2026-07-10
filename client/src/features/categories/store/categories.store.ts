import { create } from 'zustand';

type CategoryStore = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
